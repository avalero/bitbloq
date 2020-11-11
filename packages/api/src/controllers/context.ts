import { ApolloError, AuthenticationError } from "apollo-server-koa";
import { UserModel, IUser } from "../models/user";
import { IUserInToken } from "../models/interfaces";
import { sign as jwtSign, verify as jwtVerify } from "jsonwebtoken";
import { compare as bcryptCompare } from "bcrypt";

import { redisClient, userAuthService } from "../server";

import { SESSION } from "../config";

const storeTokenInRedis = async (
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

const getMyUser = async authorization => {
  let type: string | undefined;
  let justToken: string | undefined;
  if (authorization) {
    type = authorization.split(" ")[0];
    justToken = authorization.split(" ")[1] || undefined;
  }
  if (type === "Bearer" && justToken && justToken !== "null") {
    const data = await userAuthService.checkToken(justToken);
    if (data) {
      await userAuthService.userActivity(justToken);
    }
    return data;
  } else if (type === "Basic" && justToken && justToken !== "null") {
    let data: string;
    try {
      data = await Buffer.from(justToken, "base64").toString("ascii");
    } catch (e) {
      console.error(e);
      throw new ApolloError("Error with basic auth", "ERROR_IN_TOKEN");
    }
    if (!data) {
      throw new ApolloError("Error with basic auth", "ERROR_IN_TOKEN");
    }
    const email: string = data.split(":")[0];
    const pass: string = data.split(":")[1];
    const contactFound: IUser | null = await UserModel.findOne({ email });
    if (!contactFound || !contactFound.active) {
      throw new ApolloError("Token not valid.", "ERROR_IN_TOKEN");
    }
    // Compare passwords from request and database
    const valid: boolean = await bcryptCompare(pass, contactFound.password);
    if (valid) {
      const userBas: IUserInToken = {
        userId: contactFound.id as string,
        permissions: "usr-",
        submissionID: ""
      };
      return userBas;
    }
  }
};

const createUserWithSocialLogin = async (userData: IUser) => {
  // guardar datos de usuario
  const newUser = await UserModel.create(userData);
  return jwtSign(
    {
      saveUserData: newUser._id
    },
    process.env.JWT_SECRET || "",
    {
      expiresIn: "1h"
    }
  );
};

export { storeTokenInRedis, getMyUser, createUserWithSocialLogin };
