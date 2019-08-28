import { ApolloError, AuthenticationError } from "apollo-server-koa";
import { SubmissionModel } from "../models/submission";
import { UserModel, IUser } from "../models/user";
import { IUserInToken } from "../models/interfaces";
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");

import { redisClient } from "../server";

const checkOtherSessionOpen = async (user: IUserInToken, justToken: string) => {
  let reply: string;
  if (user.userID) {
    reply = await redisClient.getAsync("authToken-" + user.userID);
  } else if (user.submissionID) {
    reply = await redisClient.getAsync("subToken-" + user.submissionID);
  }
  if (reply === justToken) {
    return user;
  } else {
    throw new ApolloError(
      "Token not valid. More than one session opened",
      "ANOTHER_OPEN_SESSION"
    );
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
          user = await jsonwebtoken.verify(justToken, process.env.JWT_SECRET);
        } catch (e) {
          return undefined;
        }
        // check if there is another open session
        if (user.role === "USER") {
          if (process.env.USE_REDIS === "true") {
            return checkOtherSessionOpen(user, justToken);
          }
          return user;
        } else if (user.role === "ADMIN") {
          if (process.env.USE_REDIS === "true") {
            return checkOtherSessionOpen(user, justToken);
          }
          return user;
        } else if (user.submissionID) {
          if (process.env.USE_REDIS === "true") {
            return checkOtherSessionOpen(user, justToken);
          }
          return user;
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
      const valid: boolean = await bcrypt.compare(pass, contactFound.password);
      if (valid) {
        const userBas: IUserInToken = {
          email: contactFound.email,
          userID: contactFound._id,
          role: "BASIC",
          submissionID: null
        };
        return userBas;
      }
    }
  },
  getDataInToken: async inToken => {
    if (inToken) {
      try {
        return await jsonwebtoken.verify(inToken, process.env.JWT_SECRET);
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
    //console.log(user);
    if (user.admin) {
      token = await jsonwebtoken.sign(
        {
          email: user.email,
          userID: user._id,
          role: "ADMIN"
        },
        process.env.JWT_SECRET,
        { expiresIn: "4h" }
      );
      role = "admin";
    } else {
      token = await jsonwebtoken.sign(
        {
          email: user.email,
          userID: user._id,
          role: "USER"
        },
        process.env.JWT_SECRET,
        { expiresIn: "4h" }
      );
      role = "user";
    }
    return { token, role };
  }
};

export { contextController };
