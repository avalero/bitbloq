require('dotenv').config();

import { allSchemas } from './schemas/schemas';
import { allResolvers } from './resolvers/resolvers';

import * as mongoose from 'mongoose';
import { GraphQLSchema } from 'graphql';
import { mergeSchemas } from 'graphql-tools';
import { contextController } from './controllers/context';
const Koa = require('koa');
const { ApolloServer } = require('apollo-server-koa');

const PORT = process.env.PORT;

const mongoUrl = process.env.MONGO_URL;

mongoose.set('debug', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(
  mongoUrl,
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
    const user = await contextController.getMyUser(ctx);
    // add the user to the context
    return { user };
  },
});

const app = new Koa();

server.applyMiddleware({ app });

app.listen(PORT, () =>
  console.log('🚀 Server ready at http://localhost:4000${server.graphqlPath}'),
);
