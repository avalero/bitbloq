import { UserMong } from '../models/userModel';
import { AuthenticationError } from 'apollo-server-koa';
const jsonwebtoken = require('jsonwebtoken');

const userController = {
  signUpUser: async (_, { input }) => {
    const token = jsonwebtoken.sign(
      { email: input.email, password: input.password },
      '\x7f\x981\xcbRc67\x90I\x13\xe5*\xcc\xd2\x0b\\\x9c\x9e\xfd\x99EV\x10',
      { expiresIn: '1h' },
    );
    const user_new = new UserMong({
      email: input.email,
      password: input.password,
      name: input.name,
      center: input.center,
      active: input.active,
      signUpToken: token,
      authToken: input.auth_token,
      notifications: input.notifications,
    });
    console.log('You signed up');
    //TODO: singup token
    UserMong.create(user_new);
    return token;
  },

  login: async (root: any, { email, password }) => {
    const contactFinded = await UserMong.findOne({ email });
    if (!contactFinded) {
      throw new Error('Contact not found');
    }
    if (contactFinded.password != password) {
      throw new Error('pass error');
    }
    const token = jsonwebtoken.sign(
      { email: contactFinded.email, password: contactFinded.password },
      '\x7f\x981\xcbRc67\x90I\x13\xe5*\xcc\xd2\x0b\\\x9c\x9e\xfd\x99EV\x10',
      { expiresIn: '1h' },
    );
    console.log(token);
    return UserMong.updateOne({_id: contactFinded._id }, { $set: {authToken: token} });
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
 
  
  deleteUser: async (root: any, args: any, context) => {
    if (!context.user) return [];
    UserMong.deleteOne({ email: args.email });
  },
  updateUser: async (_, { input }, context) => {
    if (!context.user) return [];
    const contactFinded = await UserMong.findOne({ email: input.email });
    if (contactFinded) {
      //delete tempUser.id;
      return UserMong.updateOne({ _id: contactFinded._id }, { $set: input });
    } else {
      return new Error('User doesnt exist');
    }
  },
  findAllUsers: async (root: any, args: any, context) => {
    if (!context.user) return [];
    return UserMong.find({});
  },

  activateAccount: async (root: any, args: any) => {
    //TODO: activate account
  },
};

export { userController };
