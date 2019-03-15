import { AuthenticationError } from 'apollo-server-koa';
import { SubmissionModel } from '../models/submission';
import { UserModel } from '../models/user';
const jsonwebtoken = require('jsonwebtoken');

const contextController = {
  getMyUser: async context => {
    let token1: string;
    let justToken: string;
    if (context.headers) {
      // authorization for queries and mutations
      token1 = context.headers.authorization || '';
      justToken = token1.split(' ')[1];
    } else if (context.authorization) {
      // authorization for subscriptions
      token1 = context.authorization || '';
      justToken = token1.split(' ')[1];
    } else {
      token1 = '';
      justToken = '';
    }
    // comprobar si el token que recibe es el que está guardado en la base de datos
    // -> sesión única simultánea
    if (justToken) {
      let user;
      try {
        user = await jsonwebtoken.verify(justToken, process.env.JWT_SECRET);
        return user;
      } catch (e) {
        return undefined;
      }
      // if (user){
      //   // Si el token se ha resuelto y el token está guardado en las submissions
      //   // o en los ususarios se devuelve la resolución, si no existe, es que hay otra sesión abierta
      //   if (await UserModel.findOne({ authToken: justToken })){
      //     return user;
      //   } else if (await SubmissionModel.findOne({ submissionToken: justToken })) {
      //     return user;
      //   } else {
      //     throw new ApolloError(
      //       'Token not valid. More than one session opened',
      //       'ANOTHER_OPEN_SESSION',
      //     );
      //   }
      // }
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
