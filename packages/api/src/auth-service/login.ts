import { sign as jwtSign, verify as jwtVerify } from "jsonwebtoken";
import { compare as bcryptCompare } from "bcrypt";
import { AuthSessionDuration, AuthRedisClient } from "./authService";

const generateLoginToken = async (
  user
): Promise<{ token: string; role: string }> => {
  let rolePerm = "usr-";
  if (user.admin) {
    rolePerm = rolePerm.concat("admin-");
  }
  if (user.publisher) {
    rolePerm = rolePerm.concat("pub-");
  }
  if (user.teacher) {
    rolePerm = rolePerm.concat("tchr-");
  }
  if (user.teacherPro) {
    rolePerm = rolePerm.concat("tchrPro-");
  }
  if (user.family) {
    rolePerm = rolePerm.concat("fam-");
  }
  const token: string = await jwtSign(
    {
      email: user.email,
      userID: user._id,
      role: rolePerm
    },
    process.env.JWT_SECRET || ""
  );
  return { token, role: rolePerm };
};

const storeTokenInRedis = async (
  id: string,
  token: string,
  subToken?: boolean
) => {
  if (id === undefined) {
    return undefined;
  }
  let date: Date = new Date();
  date = new Date(date.setMinutes(date.getMinutes() + AuthSessionDuration));
  if (process.env.USE_REDIS === "true") {
    try {
      if (subToken) {
        return AuthRedisClient.hmset(
          String(id),
          "subToken",
          String(token),
          "expiresAt",
          date
        );
      }
      return AuthRedisClient.hmset(
        String(id),
        "authToken",
        String(token),
        "expiresAt",
        date
      );
    } catch (e) {
      return undefined;
    }
  }
};

const login = async (
  email: string,
  password: string
): Promise<string | null> => {
  const user = AuthRedisClient(email, password);
  if (!user || !user.active) {
    // send errors?
    return null;
  }
  const valid: boolean = await bcryptCompare(password, user.password);
  if (!valid) {
    return null;
  }
  const { token } = await generateLoginToken(user);
  await storeTokenInRedis(user._id, token);
  return token;
};

export { login };
