import { compare as bcryptCompare } from "bcrypt";
import { generateLoginToken, storeTokenInRedis } from "./utils";
import { getGoogleUser } from "./getGoogleData";
import { getMicrosoftUser } from "./getMicrosoftData";
import { IUserInToken } from "../models/interfaces";

import { sign as jwtSign, verify as jwtVerify } from "jsonwebtoken";
import checksSessionExpires from "./sessionExpires";

interface IUser {
  active: boolean;
  email: string;
  finishedSignUp?: boolean;
  id: string;
  password?: string;
  permissions: string;
}

export interface ISocialData {
  name: string;
  surname: string;
  id: string;
  email: string;
}

class AuthService {
  redisClient;
  sessionDuration: number;
  sessionWarning: number;
  singleSession: boolean;
  getUserData: (credentials) => Promise<IUser | null>;
  onSessionExpires:
    | ((
        key: string,
        secondsRemaining: number,
        expiredSession: boolean,
        userId: string
      ) => Promise<void>)
    | undefined;

  constructor(
    redisClient,
    sessionDuration: number,
    sessionWarning: number,
    singleSession: boolean,
    getUserData: (credentials) => Promise<IUser | null>,
    onSessionExpires?: (
      key: string,
      secondsRemaining: number,
      expiredSession: boolean,
      userId: string
    ) => Promise<void>
  ) {
    console.log(typeof redisClient);
    this.redisClient = redisClient;
    this.sessionDuration = sessionDuration;
    this.sessionWarning = sessionWarning;
    this.singleSession = singleSession;
    this.getUserData = getUserData;
    this.onSessionExpires = onSessionExpires;

    redisClient &&
      onSessionExpires &&
      setInterval(
        checksSessionExpires,
        10000,
        this.redisClient,
        this.onSessionExpires,
        this.sessionWarning
      );
  }

  async login(credentials) {
    console.log(credentials);
    const userData = await this.getUserData(credentials);
    console.log({ userData });
    if (!userData || !userData.active) {
      console.log("error");
      // send errors?
      return null;
    }
    console.log(credentials.password, userData.password);
    const valid: boolean = await bcryptCompare(
      credentials.password,
      userData.password
    );
    if (!valid) {
      return null;
    }
    const { token } = await generateLoginToken(userData);
    await storeTokenInRedis(
      this.redisClient,
      userData.id,
      token,
      this.sessionDuration,
      userData.permissions
    );
    console.log(token);
    return token;
  }

  async loginWithGoogle(token: string) {
    const googleData = await getGoogleUser(token);
    if (!googleData) {
      return { error: "GOOGLE_ERROR" };
    }
    const user = await this.getUserData({ user: googleData.email });
    if (!user) {
      return { error: "NOT_FOUND", googleData };
    }
    const { token: loginToken } = await generateLoginToken(user);
    await storeTokenInRedis(
      this.redisClient,
      user.id,
      loginToken,
      this.sessionDuration,
      user.permissions
    );
    return { loginToken, finishedSignUp: user.finishedSignUp, googleData };
  }

  async loginWithMicrosoft(token: string) {
    const microsoftData = await getMicrosoftUser(token);
    console.log({ microsoftData });
    if (!microsoftData) {
      return { error: "MICROSOFT_ERROR" };
    }
    const user = await this.getUserData({ user: microsoftData.email });
    console.log(user);
    if (!user) {
      return { error: "NOT_FOUND", microsoftData };
    }
    const { token: loginToken } = await generateLoginToken(user);
    await storeTokenInRedis(
      this.redisClient,
      user.id,
      loginToken,
      this.sessionDuration,
      user.permissions
    );
    return { loginToken, finishedSignUp: user.finishedSignUp, microsoftData };
  }

  async userActivity(token: string) {
    // Function that registers user activity in platform and updates expiresAt
    if (!token || !this.redisClient) {
      return null;
    }
    const result = await this.redisClient.hgetallAsync(token);
    return result
      ? await storeTokenInRedis(
          this.redisClient,
          result.userId,
          token,
          this.sessionDuration,
          result.permissions
        )
      : null;
  }

  async checkToken(token: string) {
    console.log("1", token);
    if (!token || !this.redisClient) {
      console.log("err");
      return null;
    }
    let result;
    try {
      result = await this.redisClient.hgetallAsync(token);
      console.log("2", result);
    } catch (e) {
      console.log(e);
    }
    return result;
  }
}

export default AuthService;
