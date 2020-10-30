import { compare as bcryptCompare } from "bcrypt";
import { generateLoginToken, storeTokenInRedis } from "./utils";
import { getGoogleUser } from "./getGoogleData";

interface IUser {
  active: boolean;
  email: string;
  finishedSignUp: boolean;
  id: string;
  password: string;
}

class AuthService {
  redisClient;

  sessionDuration: number;

  singleSession: boolean;

  getUserData: (email: string) => Promise<IUser>;

  constructor(
    redisClient,
    sessionDuration: number,
    singleSession: boolean,
    getUserData: (email: string) => Promise<IUser>
  ) {
    this.redisClient = redisClient;
    this.sessionDuration = sessionDuration;
    this.singleSession = singleSession;
    this.getUserData = getUserData;
  }

  async login(email: string, password: string) {
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
      return { error: "NOT_FOUND" };
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
}

export default AuthService;
