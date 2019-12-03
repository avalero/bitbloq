import { ApolloError, AuthenticationError } from "apollo-server-koa";
import { UserModel } from "../models/user";
import { IUserInToken, IDataInRedis } from "../models/interfaces";
import { sign as jwtSign, verify as jwtVerify } from "jsonwebtoken";
import { compare as bcryptCompare } from "bcrypt";

import { redisClient, pubsub } from "../server";
import { IUser } from "../api-types";

import { USER_SESSION_EXPIRES } from "../resolvers/user";
import { SUBMISSION_SESSION_EXPIRES } from "../resolvers/submission";

const checkOtherSessionOpen = async (user: IUserInToken, justToken: string) => {
  let reply: string | undefined;
  if (String(process.env.USE_REDIS) === "true") {
    const now: Date = new Date();
    let expiresAt: Date;
    // now.setHours(now.getHours() + 1);
    if (user.userID) {
      try {
        const result: IDataInRedis = await redisClient.hgetallAsync(
          String(user.userID)
        );
        reply = result.authToken;
        expiresAt = new Date(result.expiresAt);
      } catch (e) {
        return undefined;
      }
    } else if (user.submissionID) {
      try {
        const result: IDataInRedis = await redisClient.hgetallAsync(
          String(user.submissionID)
        );
        reply = result.subToken;
        expiresAt = new Date(result.expiresAt);
      } catch (e) {
        return undefined;
      }
    } else {
      reply = "";
      expiresAt = new Date();
    }
    if (reply === justToken) {
      if (now.getTime() > expiresAt.getTime()) {
        throw new ApolloError("Session expired", "SESSION_EXPIRED");
      }
      if (user.userID) {
        await storeTokenInRedis(user.userID, justToken);
      } else if (user.submissionID) {
        await storeTokenInRedis(user.userID, justToken, true);
      }
      return user;
    } else {
      throw new ApolloError(
        "Token not valid. More than one session opened",
        "ANOTHER_OPEN_SESSION"
      );
    }
  } else {
    return user;
  }
};

export const storeTokenInRedis = async (
  id: string,
  token: string,
  subToken?: boolean
) => {
  if (id === undefined) {
    return undefined;
  }
  const date = new Date();
  // date.setHours(date.getHours() + 1); // debería ser el tiempo que queramos que tarde en caducar la sesión
  date.setMinutes(date.getMinutes() + 6);
  if (process.env.USE_REDIS === "true") {
    if (subToken) {
      return redisClient.hmset(
        String(id),
        "subToken",
        String(token),
        "expiresAt",
        date
      );
    } else {
      return redisClient.hmset(
        String(id),
        "authToken",
        String(token),
        "expiresAt",
        date
      );
    }
  }
};

export const updateExpireDateInRedis = async (
  id: string,
  submission: boolean
) => {
  const token: string = submission
    ? (await redisClient.hgetallAsync(id)).subToken
    : (await redisClient.hgetallAsync(id)).authToken;
  return storeTokenInRedis(id, token, submission);
};

const checksSessionExpires = async () => {
  const allKeys: string[] = await redisClient.keysAsync("*");
  console.log({ allKeys });

  const now: Date = new Date();
  allKeys.map(async key => {
    const result: IDataInRedis = await redisClient.hgetallAsync(key);
    if (result && result.expiresAt) {
      const expiresAt: Date = new Date(result.expiresAt);
      if (expiresAt > now) {
        const secondsRemaining: number =
          (expiresAt.getTime() - now.getTime()) / 1000;
        console.log(secondsRemaining / 60);
        if (secondsRemaining / 60 < 5) {
          if (result.authToken) {
            console.log("subscription published user");
            pubsub.publish(USER_SESSION_EXPIRES, {
              userSessionExpires: { ...result, key, secondsRemaining }
            });
          } else if (result.subToken) {
            console.log("subscription published submission", result, key);
            pubsub.publish(SUBMISSION_SESSION_EXPIRES, {
              submissionSessionExpires: { ...result, key, secondsRemaining }
            });
          }
        }
      } else {
        redisClient.del(key);
      }
    }
  });
};

setInterval(checksSessionExpires, 5000);

const contextController = {
  getMyUser: async context => {
    let type: string;
    let token1: string;
    let justToken: string;
    if (context.headers) {
      // authorization for queries and mutations
      token1 = context.headers.authorization || "";
      type = token1.split(" ")[0];
      justToken = token1.split(" ")[1];
    } else if (context.authorization) {
      // authorization for subscriptions
      token1 = context.authorization || "";
      type = token1.split(" ")[0];
      justToken = token1.split(" ")[1];
    } else {
      token1 = "";
      type = "";
      justToken = "";
    }
    // comprobar si el token que recibe es el que está guardado en la base de datos
    // -> sesión única simultánea
    if (type === "Bearer") {
      if (justToken) {
        let user: IUserInToken;
        try {
          user = await jwtVerify(justToken, process.env.JWT_SECRET);
        } catch (e) {
          return undefined;
        }
        // check if there is another open session
        if (user.role.indexOf("usr-") > -1 || user.role.indexOf("stu-") > -1) {
          return checkOtherSessionOpen(user, justToken);
        }
      }
    } else if (type === "Basic") {
      const data:
        | string
        | undefined = await contextController.getDataInBasicAuth(justToken);
      if (!data) {
        throw new Error("No data");
      }
      const email: string = data.split(":")[0];
      const pass: string = data.split(":")[1];
      const contactFound: IUser | null = await UserModel.findOne({ email });
      if (!contactFound || !contactFound.active) {
        return undefined;
      }
      // Compare passwords from request and database
      const valid: boolean = await bcryptCompare(pass, contactFound.password);
      if (valid) {
        const userBas: IUserInToken = {
          email: contactFound.email as string,
          userID: contactFound.id as string,
          role: "usr-",
          submissionID: ""
        };
        return userBas;
      }
    }
    return;
  },
  getDataInToken: async inToken => {
    if (inToken) {
      try {
        return jwtVerify(inToken, process.env.JWT_SECRET);
      } catch (e) {
        throw new AuthenticationError("Token not value.");
      }
    }
  },

  getDataInBasicAuth: async inToken => {
    if (inToken) {
      try {
        const data: string = Buffer.from(inToken, "base64").toString("ascii");
        return data;
      } catch (e) {
        throw new AuthenticationError("Token not value.");
      }
    }
    return;
  },

  generateLoginToken: async user => {
    let token: string;
    let role: string;
    let rolePerm: string = "usr-";
    if (user.admin) {
      rolePerm = rolePerm.concat("admin-");
    }
    if (user.publisher) {
      rolePerm = rolePerm.concat("pub-");
    }
    if (user.teacher) {
      rolePerm = rolePerm.concat("tchr-");
    }
    if (user.teacherPro) {
      rolePerm = rolePerm.concat("tchrPro-");
    }
    if (user.family) {
      rolePerm = rolePerm.concat("fam-");
    }
    token = await jwtSign(
      {
        email: user.email,
        userID: user._id,
        role: rolePerm
      },
      process.env.JWT_SECRET
      // { expiresIn: "1.1h" }
    );
    role = rolePerm;
    return { token, role };
  },

  generateNewToken: async oldToken => {
    const data = await contextController.getDataInToken(oldToken);
    await checkOtherSessionOpen(data, oldToken);
    delete data.exp;
    const token = await jwtSign(
      data,
      process.env.JWT_SECRET
      // { expiresIn: "1.1h" }
    );
    return { data, token };
  }
};

export { contextController };
