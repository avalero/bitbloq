import { UserMong } from '../models/userModel';
import { AuthenticationError } from 'apollo-server-koa';
const jsonwebtoken = require('jsonwebtoken');

const userController = {
  signUpUser: (newUser) => {
    return UserMong.create(newUser);
  },

  login: async (userID, token) => {
    return UserMong.updateOne({_id: userID }, { $set: {authToken: token} });
  },

  getMyUser: async context => {
    const token1 = context.headers.authorization || '';
    const justToken = token1.split(' ')[1];

    if (justToken) {
      try {
        return await jsonwebtoken.verify(
          justToken,
          '\x7f\x981\xcbRc67\x90I\x13\xe5*\xcc\xd2\x0b\\\x9c\x9e\xfd\x99EV\x10',
        );
      } catch (e) {
        throw new AuthenticationError('Your session expired. Sign in again.');
      }
    }
  },
 
  
  deleteUser:(userID) => {
    return UserMong.deleteOne({ _id: userID});
  },
  updateUser: async (userID, data) => {
    return UserMong.updateOne({ _id: userID }, { $set: data });
  },
  findAllUsers: () => {
    return UserMong.find({});
  },

  activateAccount: async (root: any, args: any) => {
    //TODO: activate account
  },
};

export { userController };
