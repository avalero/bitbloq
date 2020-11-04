import { config } from "dotenv";
import koa from "koa";
import { ApolloServer, ApolloError } from "apollo-server-koa";

import exSchema from "./schemas/allSchemas";
import { contextController } from "./controllers/context";
import { IUserInToken } from "./models/interfaces";
import { startMongoConnection } from "./controllers/mongoose-connection";
import * as fs from "fs";
import userResolver from "./resolvers/user";
import initAuthService from "./authServices";
import initRedis from "./controllers/init-redis";

config();

const { REDIS_DOMAIN_NAME, REDIS_PORT_NUMBER, PORT, MONGO_URL } = process.env;

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

let pubsub;
let redisClient;
let studentAuthService, userAuthService;
const main = async () => {
  if (!REDIS_DOMAIN_NAME || !REDIS_PORT_NUMBER || !PORT || !MONGO_URL) {
    console.error("ERROR WITH ENV");
    return;
  }
  try {
    const redisService = await initRedis(
      REDIS_DOMAIN_NAME,
      Number(REDIS_PORT_NUMBER)
    );
    pubsub = redisService.pubsub;
    redisClient = redisService.redisClient;
    const authService = initAuthService(redisClient, pubsub);
    studentAuthService = authService.studentAuthService;
    userAuthService = authService.userAuthService;
    await startMongoConnection(String(MONGO_URL));
    const httpServer = app.listen(PORT, () => {
      console.info(`🚀 Server ready at http://localhost:${PORT}`);
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
          console.info("everything ok");
          return Promise.resolve();
        } else {
          console.error("Hello out there! API is dead");
          // Health does not fail
          return Promise.reject();
        }
      }
    });
    server.installSubscriptionHandlers(httpServer);
  } catch (e) {
    console.error("Server creation error", e);
    // if there is any unhandled error delete /tmp/ready if it exists
    fs.unlink("/tmp/ready", function(err) {
      if (err) console.error(err);
      console.error("File deleted!");
    });
  }
};

main();

export { pubsub, redisClient, studentAuthService, userAuthService };
