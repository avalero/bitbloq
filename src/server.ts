import { allSchemas } from './schemas/schemas';
import { allResolvers } from './resolvers/resolvers';

import * as mongoose from 'mongoose';
import { GraphQLSchema } from 'graphql';
import { mergeSchemas } from 'graphql-tools';
import { PersistedQueryNotFoundError } from 'apollo-server-errors';
import { publicUserController } from './public/publicUser.controller';
import { userController } from './controllers/user.controller';
const Koa = require('koa');
const { ApolloServer } = require('apollo-server-koa');
const jwt = require('koa-jwt');
const jsonwebtoken = require('jsonwebtoken');

mongoose.set('debug', true);
mongoose.connect(
  'mongodb://localhost/back_bitbloq_db',
  { useNewUrlParser: true },
  function(err: any) {
    if (err) throw err;

    console.log('Successfully connected to Mongo');
  },
);

const schema: GraphQLSchema = mergeSchemas({
  schemas: allSchemas,
  resolvers: allResolvers,
});

const server = new ApolloServer({
  schema,
  context: async ({ ctx }) => {
    const user = await userController.getMyUser(ctx);
    // add the user to the context
    return { user };
  },
});

const app = new Koa();

server.applyMiddleware({ app });

app.listen(8000, () =>
  console.log('🚀 Server ready at http://localhost:8000${server.graphqlPath}'),
);
