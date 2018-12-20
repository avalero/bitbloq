import { allSchemas } from './schemas/schemas';
import { allResolvers } from './resolvers/resolvers';

import userSchema from './schemas/user.schema';
import typeDefs from './schemas/user.schema';
import userResolver from './resolvers/user.resolver';

import * as mongoose from 'mongoose';
import { GraphQLSchema } from 'graphql';
import { mergeSchemas, makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
const Koa = require('koa');
const { ApolloServer } = require('apollo-server-koa');

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
  resolvers: allResolvers
}); 


const server = new ApolloServer({
  schema
  //resolver: userResolver
  //schema:allSchemas,
  //resolver:allResolvers
});

const app = new Koa();
server.applyMiddleware({ app });

app.listen(4000, () =>
  console.log('🚀 Server ready at http://localhost:4000${server.graphqlPath}'),
);
