import { ApolloError, AuthenticationError } from "apollo-server-koa";
import { SubmissionModel } from "../models/submission";
import { UserModel } from "../models/user";
import { IUserInToken } from "../models/interfaces";
const jsonwebtoken = require("jsonwebtoken");

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
    let token1: string;
    let justToken: string;
    if (context.headers) {
      // authorization for queries and mutations
      token1 = context.headers.authorization || "";
      justToken = token1.split(" ")[1];
    } else if (context.authorization) {
      // authorization for subscriptions
      token1 = context.authorization || "";
      justToken = token1.split(" ")[1];
    } else {
      token1 = "";
      justToken = "";
    }
    // comprobar si el token que recibe es el que está guardado en la base de datos
    // -> sesión única simultánea
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
