import { AuthenticationError, SchemaDirectiveVisitor } from 'apollo-server-koa';
import { UserModel } from '../models/user';
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
    //comprobar si el token que recibe es el que está guardado en la base de datos
    // -> sesión única simultánea
    if (justToken) {
      let user;
      try {
        user= await jsonwebtoken.verify(justToken, process.env.JWT_SECRET);
      } catch (e) {
        return undefined;
      }
      if(!(await UserModel.findOne({authToken: justToken})) && user){
        throw new AuthenticationError('Token not valid. More than one session opened');
      }else{
        return user;
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
