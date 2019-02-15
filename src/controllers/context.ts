import { AuthenticationError, SchemaDirectiveVisitor } from 'apollo-server-koa';
const jsonwebtoken = require('jsonwebtoken');

const contextController = {
  getMyUser: async context => {
    let token1: string;
    if(context.headers){ //authorization for queries and mutations
      token1 = context.headers.authorization || '' ;
    }else if(context.authorization){ //authorization for subscriptions
      token1 = context.authorization || '' ;
    }else{
      token1=context;
    }
    const justToken = token1.split(' ')[1];

    if (justToken) {
      try {
        return await jsonwebtoken.verify(justToken, process.env.JWT_SECRET);
      } catch (e) {
        return undefined;
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
