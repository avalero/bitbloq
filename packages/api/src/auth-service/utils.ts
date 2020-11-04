import { sign as jwtSign } from "jsonwebtoken";
import { randomBytes } from "crypto";

const generateLoginToken = async (
  user
): Promise<{ token: string; role: string }> => {
  const token1: string = await jwtSign(
    {
      email: user.email,
      userID: user.id,
      role: user.permissions
    },
    process.env.JWT_SECRET || ""
  );
  const token = await randomBytes(67);
  const strToken = token.toString("hex");
  return { token: strToken, role: user.permissions };
};

export interface IDataInRedis {
  token: string;
  userId?: string;
  submissionId?: string;
  expiresAt: Date;
}

const storeTokenInRedis = async (
  redisClient,
  id: string,
  token: string,
  sessionDudation: number,
  permissions: string
) => {
  if (id === undefined) {
    return undefined;
  }
  let date: Date = new Date();
  date = new Date(date.setMinutes(date.getMinutes() + sessionDudation));
  try {
    return redisClient.hmset(
      String(token),
      "userId",
      String(id),
      "expiresAt",
      date,
      "permissions",
      permissions
    );
  } catch (e) {
    return undefined;
  }
};

export { generateLoginToken, storeTokenInRedis };
