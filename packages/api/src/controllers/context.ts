import { ApolloError, AuthenticationError } from "apollo-server-koa";
import { UserModel } from "../models/user";
import { IUserInToken, IDataInRedis } from "../models/interfaces";
import { sign as jwtSign, verify as jwtVerify } from "jsonwebtoken";
import { compare as bcryptCompare } from "bcrypt";

import { redisClient, pubsub } from "../server";
import { IUser, ISubmission } from "../api-types";

import { USER_SESSION_EXPIRES } from "../resolvers/user";
import {
  SUBMISSION_SESSION_EXPIRES,
  SUBMISSION_ACTIVE
} from "../resolvers/submission";

import { SESSION } from "../config";
import { SubmissionModel } from "../models/submission";

const checkOtherSessionOpen = async (user: IUserInToken, justToken: string) => {
  let reply: string | undefined;
  if (String(process.env.USE_REDIS) === "true") {
    const now: Date = new Date();
    let expiresAt: Date;
    // now.setHours(now.getHours() + 1);
    try {
      if (user.userID) {
        const result: IDataInRedis = await redisClient.hgetallAsync(
          String(user.userID)
        );
        reply = result.authToken;
        expiresAt = new Date(result.expiresAt);
      } else if (user.submissionID) {
        const result: IDataInRedis = await redisClient.hgetallAsync(
          String(user.submissionID)
        );
        reply = result.subToken;
        expiresAt = new Date(result.expiresAt);
      } else {
        reply = "";
        expiresAt = new Date();
      }
    } catch (e) {
      return undefined;
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
  let date: Date = new Date();
  date = new Date(
    date.setMinutes(date.getMinutes() + SESSION.DURATION_MINUTES)
  );
  if (process.env.USE_REDIS === "true") {
    try {
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
    } catch (e) {
      return undefined;
    }
  }
};

export const updateExpireDateInRedis = async (
  id: string,
  submission: boolean
) => {
  if (String(process.env.USE_REDIS) === "true") {
    try {
      const token: string = submission
        ? (await redisClient.hgetallAsync(id)).subToken
        : (await redisClient.hgetallAsync(id)).authToken;
      return storeTokenInRedis(id, token, submission);
    } catch (e) {
      return undefined;
    }
  }
};

const checksSessionExpires = async () => {
  if (String(process.env.USE_REDIS) === "true") {
    const allKeys: string[] = await redisClient.keysAsync("*");
    const now: Date = new Date();
    allKeys.map(async key => {
      try {
        const result: IDataInRedis = await redisClient.hgetallAsync(key);
        if (result && result.expiresAt) {
          const expiresAt: Date = new Date(result.expiresAt);
          let secondsRemaining: number = 0;
          let topic: string = "";
          let type: string = "";
          if (result.authToken) {
            topic = USER_SESSION_EXPIRES;
            type = "userSessionExpires";
          } else if (result.subToken) {
            topic = SUBMISSION_SESSION_EXPIRES;
            type = "submissionSessionExpires";
          }
          if (expiresAt > now) {
            secondsRemaining = (expiresAt.getTime() - now.getTime()) / 1000;
            if (secondsRemaining < SESSION.SHOW_WARNING_SECONDS) {
              await pubsub.publish(topic, {
                [type]: {
                  ...result,
                  key,
                  secondsRemaining,
                  expiredSession: false,
                  showSessionWarningSecs: SESSION.SHOW_WARNING_SECONDS
                }
              });
            }
          } else {
            await pubsub.publish(topic, {
              [type]: {
                ...result,
                key,
                secondsRemaining,
                expiredSession: true,
                showSessionWarningSecs: SESSION.SHOW_WARNING_SECONDS
              }
            });
            if (type === "submissionSessionExpires") {
              const updatedSubmission: ISubmission | null = await SubmissionModel.findByIdAndUpdate(
                { _id: key },
                { $set: { active: false } },
                { new: true }
              );
              await pubsub.publish(SUBMISSION_ACTIVE, {
                submissionActive: updatedSubmission
              });
            }
            await redisClient.del(key);
          }
        }
      } catch (e) {
        await redisClient.del(key);
      }
    });
  }
};

setInterval(checksSessionExpires, 5000);

const contextController = {
  getMyUser: async authorization => {
    let type: string;
    let justToken: string;
    if (authorization) {
      type = authorization.split(" ")[0];
      justToken = authorization.split(" ")[1];
    } else {
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
    );
    role = rolePerm;
    return { token, role };
  },

  generateNewToken: async oldToken => {
    const data = await contextController.getDataInToken(oldToken);
    await checkOtherSessionOpen(data, oldToken);
    delete data.exp;
    const token = await jwtSign(data, process.env.JWT_SECRET);
    return { data, token };
  }
};

export { contextController };
