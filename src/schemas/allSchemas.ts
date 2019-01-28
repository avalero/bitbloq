import { makeExecutableSchema } from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';
import { importSchema } from 'graphql-import';
import * as path from 'path';
import { merge } from 'lodash';

import { allResolvers } from '../resolvers/resolvers';
import {AuthDirectiveResolvers} from '../controllers/authDirective';

const typeDefs = importSchema(path.join(__dirname, './allSchemas.graphql'));

const exSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: merge(allResolvers),
  //   schemaDirectives: {
  //   authRequired: AuthDirectiveResolvers
  // },
});

export default exSchema;
