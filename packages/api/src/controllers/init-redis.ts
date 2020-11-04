import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis from "ioredis";
import { RedisClient, createClient } from "redis";
import { promisifyAll } from "bluebird";

const initRedis = async (domainName: string, portNumber) => {
  // Redis configuration
  const redisOptions = {
    host: domainName,
    port: portNumber,
    retry_strategy: options =>
      // reconnect after
      Math.max(options.attempt * 100, 3000)
  };
  const allReviver = (key, value) => {
    if (value && value._id) {
      return { ...value, id: value._id };
    }
    return value;
  };
  // redis creation for subscriptions
  const pubsub = new RedisPubSub({
    publisher: new Redis(redisOptions),
    subscriber: new Redis(redisOptions),
    reviver: allReviver
  });

  // Redis client for session tokens
  // to do async/await
  promisifyAll(RedisClient.prototype);
  const redisClient = createClient(portNumber, domainName);
  redisClient.on("connect", () => {
    console.info("Redis client connected.");
  });
  return { pubsub, redisClient };
};

export default initRedis;
