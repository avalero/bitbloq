import { sign as jwtSign, verify as jwtVerify } from "jsonwebtoken";
import { compare as bcryptCompare } from "bcrypt";
import { generateLoginToken, storeTokenInRedis } from "./login";

interface IUser {
  active: boolean;
  email: string;
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
}

export default AuthService;
