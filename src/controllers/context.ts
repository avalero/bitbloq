import { ApolloError, AuthenticationError } from 'apollo-server-koa';
import { SubmissionModel } from '../models/submission';
import { UserModel } from '../models/user';
const jsonwebtoken = require('jsonwebtoken');

import { redisClient } from '../server';

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
      } catch (e) {
        return undefined;
      }
      // check if there is another open session
      if (user.userID) {
        const reply: string = await redisClient.getAsync(
          'authToken-' + user.userID,
        );
        if (reply === justToken) {
          return user;
        } else {
          throw new ApolloError(
            'Token not valid. More than one session opened',
            'ANOTHER_OPEN_SESSION',
          );
        }
      } else if (user.submissionID) {
        const reply: string = await redisClient.getAsync(
          'subToken-' + user.submissionID,
        );
        if (reply === justToken) {
          return user;
        } else {
          throw new ApolloError(
            'Token not valid. More than one session opened',
            'ANOTHER_OPEN_SESSION',
          );
        }
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
