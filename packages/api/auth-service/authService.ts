import axios from "axios";
import { compare as bcryptCompare } from "bcrypt";
import { randomBytes } from "crypto";
import { stringify } from "querystring";
import { request } from "http";
import { RedisClient } from "redis";

interface IUser {
  active?: boolean;
  email?: string;
  finishedSignUp?: boolean;
  id: string;
  password?: string;
  permissions: string;
}

interface ISocialData {
  name: string;
  surname: string;
  id: string;
  email: string;
}

interface IDataInRedis {
  token: string;
  userId: string;
  expiresAt: Date;
  permissions: string;
}

class AuthService {
  redisClient: RedisClient;
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

  constructor(args: {
    redisClient: RedisClient;
    sessionDuration: number;
    sessionWarning: number;
    singleSession: boolean;
    getUserData: (credentials) => Promise<IUser | null>;
    onSessionExpires?: (
      key: string,
      secondsRemaining: number,
      expiredSession: boolean,
      reason: string,
      userId: string
    ) => Promise<void>;
  }) {
    this.redisClient = args.redisClient;
    this.sessionDuration = args.sessionDuration;
    this.sessionWarning = args.sessionWarning;
    this.singleSession = args.singleSession;
    this.getUserData = args.getUserData;
    this.onSessionExpires = args.onSessionExpires;

    // checks open sessions every 10 seconds
    if (this.redisClient) {
      setInterval(this.checksSessionExpires.bind(this), 10000);
    }
  }

  /**
   * storeTokenInRedis: generates token if first login. Checks if there is other session open and closes it. Stores token in redis with updated expires date.
   * @param user user data
   * @param loggedToken logged token
   * @returns sotred token
   */
  async storeTokenInRedis(user: IUser, loggedToken?: string) {
    if (user.id === undefined) {
      return undefined;
    }
    let date: Date = new Date();
    date = new Date(date.setMinutes(date.getMinutes() + this.sessionDuration));
    let token = loggedToken;
    if (!loggedToken) {
      if (this.singleSession) {
        const loggedUser = await this.redisClient.hgetallAsync(String(user.id));
        if (loggedUser) {
          await Promise.all([
            this.redisClient.del(loggedUser.token),
            this.redisClient.del(String(user.id))
          ]);
          this.onSessionExpires!(
            loggedUser.token,
            0,
            true,
            "OTHER_SESSION_OPEN",
            user.id
          );
        }
      }
      const bufToken = await randomBytes(67);
      token = bufToken.toString("hex");
      await this.redisClient.hmset(String(user.id), "token", token);
    }
    try {
      await this.redisClient.hmset(
        String(token),
        "userId",
        String(user.id),
        "expiresAt",
        date,
        "permissions",
        user.permissions
      );
    } catch (e) {
      console.log({ e });
      return undefined;
    }
    return token;
  }

  /**
   * checksSessionExpires: gets all keys stored in redis and checks expiresAt date. Sends warning if seconds remaining are less than especs and expires session if time is passed.
   */
  async checksSessionExpires() {
    let allKeys: string[] = [];
    try {
      allKeys = await this.redisClient.keysAsync("*");
    } catch (e) {
      console.log(e);
    }
    const now: Date = new Date();
    allKeys.map(async key => {
      try {
        const result: IDataInRedis = await this.redisClient.hgetallAsync(key);
        if (result && result.expiresAt && result.userId) {
          const expiresAt: Date = new Date(result.expiresAt);
          let secondsRemaining = 0;
          if (expiresAt > now) {
            secondsRemaining = (expiresAt.getTime() - now.getTime()) / 1000;
            if (secondsRemaining < this.sessionWarning) {
              this.onSessionExpires &&
                this.onSessionExpires(
                  key,
                  secondsRemaining,
                  false,
                  "SESSION_EXPIRES",
                  result.userId
                );
            }
          } else {
            this.onSessionExpires &&
              this.onSessionExpires(
                key,
                secondsRemaining,
                true,
                "SESSION_EXPIRED",
                result.userId
              );
            await Promise.all([
              this.redisClient.del(key),
              this.redisClient.del(String(result.userId))
            ]);
          }
        }
      } catch (e) {
        console.error(e);
        await this.redisClient.del(key);
      }
    });
  }

  /**
   * login: login user, geting data and comparing password. Generates login token.
   * @param credentials function args credentials. Must have password field
   * @returns login token or error
   */
  async login(credentials): Promise<{ token?: string; error?: string }> {
    const user = await this.getUserData(credentials);
    if (!user || !user.active) {
      return { error: "NOT_FOUND" };
    }
    const valid: boolean = await bcryptCompare(
      credentials.password,
      user.password
    );
    if (!valid) {
      return { error: "PASSWORD_INCORRECT" };
    }
    const token = await this.storeTokenInRedis(user);
    return { token };
  }

  /**
   * loginWithGoogle: login user with google account. Gets data from google and generates login token.
   * @param token login with google token from google api.
   * @returns login token, finishedSignUp field and googleData or error
   */
  async loginWithGoogle(
    token: string
  ): Promise<{
    loginToken?: string;
    finishedSignUp?: boolean;
    googleData?: ISocialData;
    error?: string;
  }> {
    const googleData = await getGoogleUser(token);
    if (!googleData) {
      return { error: "GOOGLE_ERROR" };
    }
    const user = await this.getUserData({ user: googleData.email });
    if (!user) {
      return { error: "NOT_FOUND", googleData };
    }
    const loginToken = await this.storeTokenInRedis(user);
    return { loginToken, finishedSignUp: user.finishedSignUp, googleData };
  }

  /**
   * loginWithMicrosoft: login user with microsoft account. Gets data from microsoft and generates login token.
   * @param token login with microsoft token from microsoft api.
   * @returns login token, finishedSignUp field and microsoftData or error
   */
  async loginWithMicrosoft(
    token: string
  ): Promise<{
    loginToken?: string;
    finishedSignUp?: boolean;
    microsoftData?: ISocialData;
    error?: string;
  }> {
    const microsoftData = await getMicrosoftUser(token);
    if (!microsoftData) {
      return { error: "MICROSOFT_ERROR" };
    }
    const user = await this.getUserData({ user: microsoftData.email });
    if (!user) {
      return { error: "NOT_FOUND", microsoftData };
    }
    const loginToken = await this.storeTokenInRedis(user);
    return { loginToken, finishedSignUp: user.finishedSignUp, microsoftData };
  }

  /**
   * userActivity: updates token expiresAt date.
   * @param token user logged token
   * @returns token or null
   */
  async userActivity(token: string): Promise<string | null | undefined> {
    // Function that registers user activity in platform and updates expiresAt
    if (!token || !this.redisClient) {
      return null;
    }
    const result: IDataInRedis = await this.redisClient.hgetallAsync(token);
    return result
      ? await this.storeTokenInRedis(
          { id: result.userId, permissions: result.permissions },
          token
        )
      : null;
  }

  /**
   * checkToken: checks if token is stored in redis and session is active
   * @param token user logged token
   * @returns data in redis or null
   */
  async checkToken(token: string): Promise<IDataInRedis | null> {
    if (!token || !this.redisClient) {
      return null;
    }
    try {
      return this.redisClient.hgetallAsync(token);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default AuthService;

const getGoogleUser = (token): Promise<ISocialData> => {
  const getOptions = {
    hostname: "www.googleapis.com",
    path: "/oauth2/v2/userinfo",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  //   // Set up the request
  return new Promise((resolve, reject) => {
    let userData:
      | {
          error?: JSON;
          name: string;
          family_name: string;
          given_name: string;
          id: string;
          email: string;
          picture: string;
          birthDate: string;
        }
      | undefined;
    const req = request(getOptions);
    req.on("response", res => {
      res.setEncoding("utf8");
      res.on("data", data => {
        userData = JSON.parse(data);
        if (!userData || (userData && userData.error)) {
          reject("error with user data");
        }
        resolve({
          name: userData!.given_name || userData!.email,
          surname: userData!.family_name,
          id: userData!.id,
          email: userData!.email
        });
      });
    });

    req.on("error", err => {
      reject(err);
    });
    req.end();
  });
};

const getMicrosoftUser = async (token): Promise<ISocialData> => {
  const queryData = {
    client_id: process.env.MICROSOFT_APP_ID,
    scope: "User.Read",
    code: token,
    redirect_uri: `${process.env.FRONTEND_URL}/microsoft-redirect`,
    grant_type: "authorization_code",
    client_secret: process.env.MICROSOFT_APP_SECRET,
    state: 12345
  };

  let accessToken: string;
  try {
    const result = await axios.post(
      "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      stringify(queryData)
    );
    accessToken = result.data.access_token;
  } catch (e) {
    console.log("error with code and getting user token", e);
  }

  return new Promise((resolve, reject) => {
    if (accessToken) {
      try {
        axios
          .get("https://graph.microsoft.com/v1.0/me", {
            headers: { Authorization: `Bearer ${accessToken}` }
          })
          .then(response => {
            resolve({
              name: response.data.displayName,
              surname: response.data.surname,
              id: response.data.id,
              email: response.data.mail
                ? response.data.mail
                : response.data.userPrincipalName
            });
          });
      } catch (e) {
        console.log("error getting user data", e);
        reject(e);
      }
    }
  });
};
