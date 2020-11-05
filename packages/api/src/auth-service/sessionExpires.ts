import { IDataInRedis } from "./utils";

const checksSessionExpires = async (
  redisClient,
  onSessionExpires,
  sessionWarning
) => {
  const allKeys: string[] = await redisClient.keysAsync("*");
  const now: Date = new Date();
  allKeys.map(async key => {
    try {
      const result: IDataInRedis = await redisClient.hgetallAsync(key);
      console.log({ key, result });
      if (result && result.expiresAt) {
        const expiresAt: Date = new Date(result.expiresAt);
        let secondsRemaining = 0;
        if (expiresAt > now) {
          secondsRemaining = (expiresAt.getTime() - now.getTime()) / 1000;
          if (secondsRemaining < sessionWarning) {
            onSessionExpires(key, secondsRemaining, false, result.userId);
          }
        } else {
          onSessionExpires(key, secondsRemaining, true, result.userId);
          await Promise.all([
            redisClient.del(key),
            redisClient.del(String(result.userId))
          ]);
        }
      }
    } catch (e) {
      await redisClient.del(key);
    }
  });
};

export default checksSessionExpires;
