import { userController } from '../controllers/user.controller';
import { UserMong, ContactSchema } from '../models/userModel';
import { AuthenticationError } from 'apollo-server-koa';
const jsonwebtoken = require('jsonwebtoken');

const userResolver = {
  Mutation: {
    //public methods:
    signUpUser(root: any, args: any) {
      const token = jsonwebtoken.sign(
        { email: args.input.email, password: args.input.password },
        '\x7f\x981\xcbRc67\x90I\x13\xe5*\xcc\xd2\x0b\\\x9c\x9e\xfd\x99EV\x10',
        { expiresIn: '1h' },
      );
      console.log(args.input);
      const user_new = new UserMong({
        email: args.input.email,
        password: args.input.password,
        name: args.input.name,
        center: args.input.center,
        active: args.input.active,
        signUpToken: token,
        authToken: args.input.auth_token,
        notifications: args.input.notifications,
      });
      return userController.signUpUser(user_new);
    },
    async login(root: any, { email, password }) {
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
      return userController.login(contactFinded._id, token);
    },

    //private methods:
    activateAccount(root: any, args: any) {
      return userController.activateAccount(root, args);
    },
    async deleteUser(root: any, args:any, context: any) {
      if (!context.user) return [];
      const contactFinded = await UserMong.findOne({ email: context.user.email });
      return userController.deleteUser(contactFinded._id);
    },
    async updateUser(root: any, args:any, context: any, input:any) {
      if (!context.user) return [];
      const contactFinded = await UserMong.findOne({ email: context.user.email });
      if (contactFinded) {
        //delete tempUser.id;
        return userController.updateUser(contactFinded._id, {input});
      } else {
        return new Error('User doesnt exist');
      }
    },
  },
  Query: {
    users(root: any, args: any, context: any) {
      if (!context.user) return [];
      return userController.findAllUsers();
    },
  },
};

export default userResolver;
