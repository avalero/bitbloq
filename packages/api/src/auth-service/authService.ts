import { compare as bcryptCompare } from "bcrypt";
import {
  generateLoginToken,
  storeTokenInRedis,
  generateLoginTokenWithSingleSession
} from "./utils";
import { getGoogleUser } from "./getGoogleData";
import { getMicrosoftUser } from "./getMicrosoftData";
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
        reason: string,
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
      reason: string,
      userId: string
    ) => Promise<void>
  ) {
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
    const userData = await this.getUserData(credentials);
    if (!userData || !userData.active) {
      if (userData && credentials.socialId) {
        // First login with google / MS
        const token = this.singleSession
          ? await generateLoginTokenWithSingleSession(
              this.redisClient,
              userData,
              this.onSessionExpires
            )
          : await generateLoginToken(this.redisClient, userData);
        await storeTokenInRedis(
          this.redisClient,
          userData.id,
          token,
          this.sessionDuration,
          userData.permissions
        );
        return token;
      }
      return { error: "NOT_FOUND" };
    }
    const valid: boolean = await bcryptCompare(
      credentials.password,
      userData.password
    );
    if (!valid) {
      return null;
    }
    const token = this.singleSession
      ? await generateLoginTokenWithSingleSession(
          this.redisClient,
          userData,
          this.onSessionExpires
        )
      : await generateLoginToken(this.redisClient, userData);
    await storeTokenInRedis(
      this.redisClient,
      userData.id,
      token,
      this.sessionDuration,
      userData.permissions
    );
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
    const loginToken = this.singleSession
      ? await generateLoginTokenWithSingleSession(
          this.redisClient,
          user,
          this.onSessionExpires
        )
      : await generateLoginToken(this.redisClient, user);
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
    if (!microsoftData) {
      return { error: "MICROSOFT_ERROR" };
    }
    const user = await this.getUserData({ user: microsoftData.email });
    if (!user) {
      return { error: "NOT_FOUND", microsoftData };
    }
    const loginToken = this.singleSession
      ? await generateLoginTokenWithSingleSession(
          this.redisClient,
          user,
          this.onSessionExpires
        )
      : await generateLoginToken(this.redisClient, user);
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
    if (!token || !this.redisClient) {
      return null;
    }
    let result;
    try {
      result = await this.redisClient.hgetallAsync(token);
    } catch (e) {
      console.error(e);
    }
    return result;
  }
}

export default AuthService;
