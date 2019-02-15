import { AuthenticationError, SchemaDirectiveVisitor } from 'apollo-server-koa';
const jsonwebtoken = require('jsonwebtoken');

const contextController = {
  getMyUser: async context => {
    let token1: string;
    let justToken: string;
    if(context.headers){ //authorization for queries and mutations
      token1 = context.headers.authorization || '' ;
      justToken = token1.split(' ')[1];
    }else if(context.authorization){ //authorization for subscriptions
      token1 = context.authorization || '' ;
      justToken = token1.split(' ')[1];
    }else{
      token1='';
      justToken='';
    }
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
