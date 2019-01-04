import { UserMong } from '../models/userModel';
import { AuthenticationError } from 'apollo-server-koa';
const jsonwebtoken = require('jsonwebtoken');

const userController = {
  signUpUser: (newUser) => {
    return UserMong.create(newUser);
  },

  getMyUser: async context => {
    const token1 = context.headers.authorization || '';
    const justToken = token1.split(' ')[1];

    if (justToken) {
      try {
        return await jsonwebtoken.verify(
          justToken,
          process.env.JWT_SECRET
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
};

export { userController };
