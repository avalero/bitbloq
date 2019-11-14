import { ApolloError, AuthenticationError } from "apollo-server-koa";
import { UserModel } from "../models/user";
import { IUserInToken } from "../models/interfaces";
import { sign as jwtSign, verify as jwtVerify } from "jsonwebtoken";
import { compare as bcryptCompare } from "bcrypt";

import { redisClient } from "../server";

const checkOtherSessionOpen = async (user: IUserInToken, justToken: string) => {
  let reply: string;
  if (String(process.env.USE_REDIS) === "true") {
    if (user.userID) {
      try {
        reply = await redisClient.getAsync(`authToken-${user.userID}`);
      } catch (e) {
        return undefined;
      }
    } else if (user.submissionID) {
      try {
        reply = await redisClient.getAsync(`subToken-${user.submissionID}`);
      } catch (e) {
        return undefined;
      }
    }
    if (reply === justToken) {
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
      const data = await contextController.getDataInBasicAuth(justToken);
      const email: string = data.split(":")[0];
      const pass: string = data.split(":")[1];
      const contactFound = await UserModel.findOne({ email });
      if (!contactFound) {
        throw new AuthenticationError("Email or password incorrect");
      }
      if (!contactFound.active) {
        throw new ApolloError(
          "Not active user, please activate your account",
          "NOT_ACTIVE_USER"
        );
      }
      // Compare passwords from request and database
      const valid: boolean = await bcryptCompare(pass, contactFound.password);
      if (valid) {
        const userBas: IUserInToken = {
          email: contactFound.email,
          userID: contactFound._id,
          role: "usr-",
          submissionID: null
        };
        return userBas;
      }
    }
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
      process.env.JWT_SECRET,
      { expiresIn: "1.1h" }
    );
    role = rolePerm;
    return { token, role };
  },

  generateNewToken: async oldToken => {
    const data = await contextController.getDataInToken(oldToken);
    await checkOtherSessionOpen(data, oldToken);
    delete data.exp;
    const token = await jwtSign(data, process.env.JWT_SECRET, {
      expiresIn: "1.1h"
    });
    return { data, token };
  }
};

export { contextController };
