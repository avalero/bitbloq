import { AuthenticationError, SchemaDirectiveVisitor } from 'apollo-server-koa';
import {
  defaultFieldResolver,
  GraphQLDirective,
  DirectiveLocation,
} from 'graphql';
import { nonExecutableDefinitionMessage } from 'graphql/validation/rules/ExecutableDefinitions';
const jsonwebtoken = require('jsonwebtoken');

const contextController = {
  getMyUser: async context => {
    const token1 = context.headers.authorization || '';
    const justToken = token1.split(' ')[1];

    if (justToken) {
      try {
        return await jsonwebtoken.verify(justToken, process.env.JWT_SECRET);
      } catch (e) {
        throw new AuthenticationError('Your session expired. Sign in again.');
      }
    }
  },
  getDataInToken: async inToken => {
    if (inToken) {
      try {
        return await jsonwebtoken.verify(inToken, process.env.JWT_SECRET);
      } catch (e) {
        throw new AuthenticationError('Token not value.');
      }
    }
  },
};

export { contextController };
