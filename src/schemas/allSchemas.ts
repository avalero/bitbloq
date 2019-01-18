import { makeExecutableSchema } from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';
import { importSchema } from 'graphql-import';
import * as path from 'path';
import { merge } from 'lodash';

import { allResolvers } from '../resolvers/resolvers';

const typeDefs = importSchema(path.join(__dirname, './allSchemas.graphql'));

const exSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: merge(allResolvers),
});

export default exSchema;
