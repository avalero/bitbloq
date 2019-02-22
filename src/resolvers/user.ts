import { ApolloError, AuthenticationError } from 'apollo-server-koa';
import { ObjectID } from 'bson';
import { contextController } from '../controllers/context';
import { mailerController } from '../controllers/mailer';
import { DocumentModel } from '../models/document';
import { ExerciseModel } from '../models/exercise';
import { LogModel } from '../models/logs';
import { SubmissionModel } from '../models/submission';
import { UserModel } from '../models/user';

import { template } from '../email/welcomeMail';
import  * as mjml2html from 'mjml';

const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const saltRounds = 7;

const userResolver = {
  Mutation: {
    // Public mutations:

    /**
     * Sign up user: register a new uer.
     * It sends a e-mail to activate the account and check if the registered account exists.
     * args: email, password and user information.
     */
    signUpUser: async (root: any, args: any) => {
      const contactFound = await UserModel.findOne({
        email: args.input.email,
      });
      if (contactFound) {
        throw new ApolloError('This user already exists', 'USER_EMAIL_EXISTS');
      }
      // Store the password with a hash
      const hash: string = await bcrypt.hash(args.input.password, saltRounds);
      const userNew = new UserModel({
        id: ObjectID,
        email: args.input.email,
        password: hash,
        name: args.input.name,
        center: args.input.center,
        active: false,
        authToken: ' ',
        notifications: args.input.notifications,
        signUpSurvey: args.input.signUpSurvey,
      });
      const newUser = await UserModel.create(userNew);
      const token: string = jsonwebtoken.sign(
        {
          signUpUserID: newUser._id,
        },
        process.env.JWT_SECRET,
      );
      console.log(token);

      const data={
        activationUrl: `${process.env.FRONTEND_URL}/app/activate?token=${token}`
      }
      const mjml=template(data);
      const htmlMessage=mjml2html(mjml, {keepComments: false, beautify:true, minify: true});
      const message: string = `Ha registrado este e-mail para crear una cuenta en el nuevo Bitbloq, si es así, pulse este link para confirmar su correo electrónico y activar su cuenta Bitbloq:
        <a href="${process.env.FRONTEND_URL}/app/activate?token=${token}">
          pulse aquí
        </a>
      `;
      await mailerController.sendEmail(newUser.email, 'Bitbloq Sign Up ✔', htmlMessage.html);
      await UserModel.findOneAndUpdate(
        { _id: newUser._id },
        { $set: { signUpToken: token } },
        { new: true },
      );
      await LogModel.create({
        user: newUser._id,
        action: 'USER_create',
      });
      return 'OK';
    },

    /*
      Login: login with a registered user.
      It returns the authorization token with user information.
      args: email and password.
    */
    login: async (root: any, { email, password }) => {
      const contactFound = await UserModel.findOne({ email });
      if (!contactFound) {
        throw new AuthenticationError('Email or password incorrect');
      }
      if (!contactFound.active) {
        throw new ApolloError(
          'Not active user, please activate your account',
          'NOT_ACTIVE_USER',
        );
      }
      // Compare passwords from request and database
      const valid: boolean = await bcrypt.compare(
        password,
        contactFound.password,
      );
      if (valid) {
        const token: string = jsonwebtoken.sign(
          {
            email: contactFound.email,
            userID: contactFound._id,
            role: 'USER',
          },
          process.env.JWT_SECRET,
          { expiresIn: '4h' },
        );
        UserModel.updateOne(
          { _id: contactFound._id },
          { $set: { authToken: token } },
        );
        await LogModel.create({
          user: contactFound._id,
          action: 'USER_login',
        });
        return token;
      } else {
        throw new ApolloError(
          'comparing passwords valid=false',
          'PASSWORD_ERROR',
        );
      }
    },

    // Private methods:

    /*
      Activate Account: activates the new account of the user registered.
      It takes the information of the token received and activates the account created before.
      args: sign up token. This token is provided in the email sent.
    */
    activateAccount: async (root: any, args: any, context: any) => {
      if (!args.token) {
        throw new ApolloError(
          'Error with sign up token, no token in args',
          'NOT_TOKEN_PROVIDED',
        );
      }
      const userInToken = await contextController.getDataInToken(args.token);
      const contactFound = await UserModel.findOne({
        _id: userInToken.signUpUserID,
      });
      if (userInToken.signUpUserID && !contactFound.active) {
        const token: string = jsonwebtoken.sign(
          {
            email: contactFound.email,
            userID: contactFound._id,
            role: 'USER',
          },
          process.env.JWT_SECRET,
          { expiresIn: '4h' },
        );
        await UserModel.findOneAndUpdate(
          { _id: contactFound._id },
          {
            $set: {
              active: true,
              authToken: token,
              signUpToken: ' ',
            },
          },
        );
        return token;
      } else {
        return new ApolloError(
          'Error with sign up token, try again',
          'TOKEN_NOT_VALUE',
        );
      }
    },

    /**
     * Delete user: delete own user.
     * It deletes the user passed by the ID if it is the same as the passed by token.
     * This method deletes all the documents, exercises and submissions related with this user.
     * args: user ID.
     */
    deleteUser: async (root: any, args: any, context: any) => {
      const contactFound = await UserModel.findOne({
        email: context.user.email,
        _id: context.user.userID,
      });
      if (contactFound._id === args.id) {
        await LogModel.create({
          user: contactFound._id,
          action: 'USER_delete',
        });
        await SubmissionModel.deleteMany({ user: contactFound._id });
        await ExerciseModel.deleteMany({ user: contactFound._id });
        await DocumentModel.deleteMany({ user: contactFound._id });
        return UserModel.deleteOne({ _id: contactFound._id }); // Delete every data of the user
      } else {
        throw new ApolloError(
          'Can not delete a user that is not yours',
          'DELETE_USER_ERROR',
        );
      }
    },

    /*
      Update user: update existing user.
      It updates the user with the new information provided.
      args: user ID, new user information.
    */
    updateUser: async (root: any, args: any, context: any, input: any) => {
      const contactFound = await UserModel.findOne({
        email: context.user.email,
        _id: context.user.userID,
      });
      if (contactFound._id === args.id) {
        await LogModel.create({
          user: contactFound._id,
          action: 'USER_update',
        });
        const data = args.input;
        return UserModel.updateOne({ _id: contactFound._id }, { $set: data });
      } else {
        return new ApolloError('User does not exist', 'USER_NOT_FOUND');
      }
    },
  },

  Query: {
    /**
     *  Me: returns the information of the user provided in the authorization token.
     *  args: nothing.
     */
    me: async (root: any, args: any, context: any) => {
      const contactFound = await UserModel.findOne({
        email: context.user.email,
        _id: context.user.userID,
      });
      if (!contactFound) {
        return new ApolloError('Error with user in context', 'USER_NOT_FOUND');
      }
      await LogModel.create({
        user: contactFound._id,
        action: 'USER_me',
      });
      return contactFound;
    },

    /**
     *  Users: returns all the users in the platform. It can be executed only by admin user.
     *  args: nothing.
     */
    users(root: any, args: any, context: any) {
      return UserModel.find({});
    },
  },

  User: {
    documents: async user => DocumentModel.find({ user: user._id }),
  },
};

export default userResolver;
