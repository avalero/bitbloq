import { config } from "dotenv";

import { set as mongooseSet, connect as mongooseConnect } from "mongoose";

import koa from "koa";
import { ApolloServer, ApolloError } from "apollo-server-koa";
import { PubSub } from "apollo-server";
import { RedisPubSub } from "graphql-redis-subscriptions";

import Redis from "ioredis";
import { RedisClient, createClient } from "redis";
import { promisifyAll } from "bluebird";
import exSchema from "./schemas/allSchemas";
import { contextController } from "./controllers/context";
import { IUserInToken } from "./models/interfaces";
import { startMongoConnection } from "./controllers/mongoose-connection";
import * as fs from "fs";
import userResolver from "./resolvers/user";

config();

const { REDIS_DOMAIN_NAME } = process.env;
const { REDIS_PORT_NUMBER } = process.env;
const USE_REDIS = String(process.env.USE_REDIS);

const { PORT } = process.env;

const mongoUrl: string = process.env.MONGO_URL as string;

mongooseSet("debug", true);
mongooseSet("useFindAndModify", false); // ojo con esto al desplegar
mongooseConnect(
  mongoUrl,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
  (err: any) => {
    if (err) {
      throw err;
    }
    console.log("Successfully connected to Mongo");
  }
);

let pubsub;
let redisClient;
if (USE_REDIS === "true") {
  // Redis configuration
  const redisOptions = {
    host: REDIS_DOMAIN_NAME,
    port: REDIS_PORT_NUMBER,
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
  pubsub = new RedisPubSub({
    publisher: new Redis(redisOptions),
    subscriber: new Redis(redisOptions),
    reviver: allReviver
  });

  // Redis client for session tokens
  // to do async/await
  promisifyAll(RedisClient.prototype);
  redisClient = createClient(REDIS_PORT_NUMBER, REDIS_DOMAIN_NAME);
  redisClient.on("connect", () => {
    console.log("Redis client connected.");
  });
} else {
  pubsub = new PubSub();
}

const app = new koa();

const server = new ApolloServer({
  context: async ({ ctx, payload, req, connection }) => {
    const authorization =
      (ctx && ctx.headers && ctx.headers.authorization) ||
      (payload && payload.authorization) ||
      "";

    const user: IUserInToken | undefined = await contextController.getMyUser(
      authorization
    );
    return { user, headers: ctx && ctx.headers }; //  add the user to the ctx
  },
  schema: exSchema
});

const main = async () => {
  try {
    await startMongoConnection(mongoUrl);
    const httpServer = app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}`);
      // set readiness file
      fs.writeFile("/tmp/ready", "ready", function(err) {
        if (err) throw err;
        console.info("/tmp/ready file created");
      });
    });

    server.applyMiddleware({
      app,
      onHealthCheck: async () => {
        // Replace the `true` in this conditional with more specific checks!
        // Log does not appear
        if (await userResolver.Mutation.login) {
          console.log("everything ok");
          return Promise.resolve();
        } else {
          console.log("Hello out there! API is dead");
          // Health does not fail
          return Promise.reject();
        }
      }
    });
    server.installSubscriptionHandlers(httpServer);
  } catch (e) {
    // if there is any unhandled error delete /tmp/ready if it exists
    fs.unlink("/tmp/ready", function(err) {
      if (err) console.error(err);
      console.error("File deleted!");
    });
  }
};

main();

export { pubsub, redisClient };
