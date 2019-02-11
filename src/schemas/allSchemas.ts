import { makeExecutableSchema } from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';
import { importSchema } from 'graphql-import';
import { merge } from 'lodash';
import * as path from 'path';

import { AuthDirectiveResolvers } from '../controllers/authDirective';
import { allResolvers } from '../resolvers/resolvers';

const typeDefs = importSchema(path.join(__dirname, './allSchemas.graphql'));

const exSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers: merge(allResolvers),
  schemaDirectives: {
    authRequired: AuthDirectiveResolvers,
  },
});

export default exSchema;
