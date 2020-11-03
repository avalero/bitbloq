import { sign as jwtSign } from "jsonwebtoken";

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
      userID: user.id,
      role: rolePerm
    },
    process.env.JWT_SECRET || ""
  );
  return { token, role: rolePerm };
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
  subToken?: boolean
) => {
  if (id === undefined) {
    return undefined;
  }
  let date: Date = new Date();
  date = new Date(date.setMinutes(date.getMinutes() + sessionDudation));
  try {
    if (subToken) {
      return redisClient.hmset(
        String(token),
        "submissionId",
        String(id),
        "expiresAt",
        date
      );
    }
    return redisClient.hmset(
      String(token),
      "userId",
      String(id),
      "expiresAt",
      date
    );
  } catch (e) {
    return undefined;
  }
};

export { generateLoginToken, storeTokenInRedis };
