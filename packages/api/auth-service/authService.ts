import axios from "axios";
import { compare as bcryptCompare } from "bcrypt";
import { randomBytes } from "crypto";
import { stringify } from "querystring";
import { request } from "http";

interface IUser {
  active?: boolean;
  email?: string;
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

export interface IDataInRedis {
  token: string;
  userId: string;
  expiresAt: Date;
  permissions: string;
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

    setInterval(this.checksSessionExpires, 10000);
  }

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
      return undefined;
    }
    return token;
  }

  async checksSessionExpires() {
    const allKeys: string[] = await this.redisClient.keysAsync("*");
    const now: Date = new Date();
    allKeys.map(async key => {
      try {
        const result: IDataInRedis = await this.redisClient.hgetallAsync(key);
        if (
          result &&
          result.expiresAt &&
          result.userId &&
          this.onSessionExpires
        ) {
          const expiresAt: Date = new Date(result.expiresAt);
          let secondsRemaining = 0;
          if (expiresAt > now) {
            secondsRemaining = (expiresAt.getTime() - now.getTime()) / 1000;
            if (secondsRemaining < this.sessionWarning) {
              this.onSessionExpires(
                key,
                secondsRemaining,
                false,
                "SESSION_EXPIRES",
                result.userId
              );
            }
          } else {
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
  async login(credentials) {
    const user = await this.getUserData(credentials);
    if (!user || !user.active) {
      return { error: "NOT_FOUND" };
    }
    const valid: boolean = await bcryptCompare(
      credentials.password,
      user.password
    );
    if (!valid) {
      return null;
    }
    const token = await this.storeTokenInRedis(user);
    return { token };
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
    const loginToken = await this.storeTokenInRedis(user);
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
    const loginToken = await this.storeTokenInRedis(user);
    return { loginToken, finishedSignUp: user.finishedSignUp, microsoftData };
  }

  async userActivity(token: string) {
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

  async checkToken(token: string) {
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
