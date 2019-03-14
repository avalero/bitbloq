require('dotenv').config();

import * as mongoose from 'mongoose';
import { contextController } from './controllers/context';
import exSchema from './schemas/allSchemas';

import Koa = require('koa');
const { ApolloServer, AuthenticationError } = require('apollo-server-koa');

import { RedisPubSub } from 'graphql-redis-subscriptions';
import * as Redis from 'ioredis';

const PORT = process.env.PORT;

const REDIS_DOMAIN_NAME = process.env.REDIS_DOMAIN_NAME;
const REDIS_PORT_NUMBER = process.env.REDIS_PORT_NUMBER;

const mongoUrl: string = process.env.MONGO_URL;

mongoose.set('debug', true);
mongoose.set('useFindAndModify', false); // ojo con esto al desplegar
mongoose.connect(
  mongoUrl,
  { useNewUrlParser: true, useCreateIndex: true },
  (err: any) => {
    if (err) {
      throw err;
    }

    console.log('Successfully connected to Mongo');
  },
);

const app = new Koa();

// Redis configuration
const redisOptions = {
  host: REDIS_DOMAIN_NAME,
  port: REDIS_PORT_NUMBER,
  retry_strategy: options => {
    // reconnect after
    return Math.max(options.attempt * 100, 3000);
  },
};
const allReviver = (key, value) => {
  if (value && value._id) {
    return { ...value, id: value._id };
  }
  return value;
};
// redis creation for subscriptions
export const pubsub: RedisPubSub = new RedisPubSub({
  publisher: new Redis(redisOptions),
  subscriber: new Redis(redisOptions),
  reviver: allReviver
});

const httpServer = app.listen(PORT, () =>
  console.log(`app is listening on port ${PORT}`),
);

const server = new ApolloServer({
  context: async ({ ctx, req, connection }) => {
    if (connection) {
      // check connection for metadata
      return connection.context;
    } else {
      const user = await contextController.getMyUser(ctx);
      return { user }; //  add the user to the ctx
    }
  },
  schema: exSchema,
  upload: {
    maxFileSize: 10000000,
    maxFiles: 1,
  },
  subscriptions: {
    onConnect: async (connectionParams, webSocket) => {
      if (connectionParams.authorization) {
        const justToken = connectionParams.authorization.split(' ')[1];
        const user = await contextController.getDataInToken(justToken);
        return { user }; //  add the user to the ctx
      }
      throw new AuthenticationError('You need to be logged in');
    },
  },
});

server.applyMiddleware({ app });
server.installSubscriptionHandlers(httpServer);
