import { userController } from '../controllers/user';
import { DocumentModelController } from '../controllers/document';
import { UserModel } from '../models/user';
import { contextController } from '../controllers/context';
import { AuthenticationError } from 'apollo-server-koa';
import { ObjectID } from 'bson';
const jsonwebtoken = require('jsonwebtoken');

const userResolver = {
  Mutation: {
    //public methods:
    async signUpUser(root: any, args: any) {
      const contactFinded = await UserModel.findOne({
        email: args.input.email,
      });
      if (contactFinded) {
        throw new Error('This user already exists');
      }
      const token = jsonwebtoken.sign(
        {
          email: args.input.email,
          password: args.input.password,
          signUp: true,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
      );
      console.log(args.input);
      const user_new = new UserModel({
        id: ObjectID,
        email: args.input.email,
        password: args.input.password,
        name: args.input.name,
        center: args.input.center,
        active: false,
        signUpToken: token,
        authToken: 'patata',
        notifications: args.input.notifications,
      });
      userController.signUpUser(user_new);
      return token;
    },
    async login(root: any, { email, password }) {
      const contactFinded = await UserModel.findOne({ email });
      if (!contactFinded || contactFinded.password != password) {
        throw new Error('Contact not found or password incorrect');
      }
      if (!contactFinded.active) {
        throw new Error('Not active user, please activate your account');
      }
      const token: String = jsonwebtoken.sign(
        {
          email: contactFinded.email,
          password: contactFinded.password,
          signUp: false,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
      );
      userController.updateUser(contactFinded._id, { authToken: token });
      return token;
    },

    //private methods:

    async activateAccount(root: any, args: any, context: any) {
      if (!args.token)
        throw new Error('Error with sign up token, no token in args');
      const userInToken = await contextController.getDataInToken(args.token);
      const contactFinded = await UserModel.findOne({
        email: userInToken.email,
      });
      if (userInToken.signUp && !contactFinded.active) {
        var token: String = jsonwebtoken.sign(
          { email: contactFinded.email, password: contactFinded.password },
          process.env.JWT_SECRET,
          { expiresIn: '1h' },
        );
        userController.updateUser(contactFinded._id, {
          active: true,
          authToken: token,
          signUpToken: ' ',
        });
        return token;
      } else {
        return new Error('Error with sign up token, try again');
      }
    },

    async deleteUser(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const contactFinded = await UserModel.findOne({
        email: context.user.email,
      });
      if (contactFinded._id == args.id)
        DocumentModelController.deleteManyDocs(contactFinded._id); // Delete all the user's documents
      return userController.deleteUser(contactFinded._id); //Delete the user
    },

    async updateUser(root: any, args: any, context: any, input: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const contactFinded = await UserModel.findOne({
        email: context.user.email,
      });
      if (contactFinded._id == args.id) {
        const data = args.input;
        return userController.updateUser(contactFinded._id, data);
      } else {
        return new Error('User doesnt exist');
      }
    },
  },

  Query: {
    async me(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      const contactFinded = await UserModel.findOne({
        email: context.user.email,
      });
      if (!contactFinded) return new Error('Error with user in context');
      return contactFinded;
    },
    users(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      return userController.findAllUsers();
    },
  },
};

export default userResolver;
