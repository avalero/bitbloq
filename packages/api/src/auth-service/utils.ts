import { randomBytes } from "crypto";

const generateLoginToken = async (
  redisClient,
  user,
  onSessionExpires
): Promise<{ token: string; role: string }> => {
  const loggedUser = await redisClient.hgetallAsync(String(user.id));
  if (loggedUser) {
    await Promise.all([
      redisClient.del(loggedUser.token),
      redisClient.del(String(user.id))
    ]);
    // TODO: add reason to sessionExpires
    onSessionExpires(loggedUser.token, 0, true, "OTHER_SESSION_OPEN", user.id);
  }
  const token = await randomBytes(67);
  const strToken = token.toString("hex");
  await redisClient.hmset(String(user.id), "token", strToken);
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
