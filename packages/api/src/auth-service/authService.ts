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
  finishedSignUp: boolean;
  id: string;
  password: string;
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
  getUserData: (email: string) => Promise<IUser | null>;
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
    getUserData: (email: string) => Promise<IUser | null>,
    onSessionExpires?: (
      key: string,
      secondsRemaining: number,
      expiredSession: boolean,
      userId: string
    ) => Promise<void>
  ) {
    this.redisClient = redisClient;
    this.sessionDuration = sessionDuration;
    this.sessionWarning = sessionWarning;
    this.singleSession = singleSession;
    this.getUserData = getUserData;
    this.onSessionExpires = onSessionExpires;

    onSessionExpires &&
      setInterval(
        checksSessionExpires,
        5000,
        this.redisClient,
        this.onSessionExpires,
        this.sessionWarning
      );
  }

  async login(email: string, password: string) {
    console.log(email);
    const user = await this.getUserData(email);
    console.log(user);
    if (!user || !user.active) {
      // send errors?
      return null;
    }
    const valid: boolean = await bcryptCompare(password, user.password);
    if (!valid) {
      return null;
    }
    const { token } = await generateLoginToken(user);
    await storeTokenInRedis(
      this.redisClient,
      user.id,
      token,
      this.sessionDuration
    );
    console.log(token);
    return token;
  }

  async loginWithGoogle(token: string) {
    const googleData = await getGoogleUser(token);
    if (!googleData) {
      return { error: "GOOGLE_ERROR" };
    }
    const user = await this.getUserData(googleData.email);
    if (!user) {
      return { error: "NOT_FOUND", googleData };
    }
    const { token: loginToken } = await generateLoginToken(user);
    await storeTokenInRedis(
      this.redisClient,
      user.id,
      loginToken,
      this.sessionDuration
    );
    return { loginToken, finishedSignUp: user.finishedSignUp, googleData };
  }

  async loginWithMicrosoft(token: string) {
    const microsoftData = await getMicrosoftUser(token);
    console.log({ microsoftData });
    if (!microsoftData) {
      return { error: "MICROSOFT_ERROR" };
    }
    const user = await this.getUserData(microsoftData.email);
    console.log(user);
    if (!user) {
      return { error: "NOT_FOUND", microsoftData };
    }
    const { token: loginToken } = await generateLoginToken(user);
    await storeTokenInRedis(
      this.redisClient,
      user.id,
      loginToken,
      this.sessionDuration
    );
    return { loginToken, finishedSignUp: user.finishedSignUp, microsoftData };
  }

  async userActivity(token: string) {
    // Function that registers user activity in platform and updates expiresAt
    const result = await this.redisClient.hgetallAsync(token);
    return result
      ? await storeTokenInRedis(
          this.redisClient,
          result.userID,
          token,
          this.sessionDuration
        )
      : null;
  }

  async checkToken(token: string) {
    //TODO: function that checks if token is valid or not
  }

  // onSessionExpireWarning(callback: (user: User, secondsRemaining: number) => void)
  // onSessionExpired(callback: (user: User) => void)
}

export default AuthService;
