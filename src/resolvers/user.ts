import { UserModel } from '../models/user';
import { DocumentModel } from '../models/document';
import { ExerciseModel } from '../models/exercise';
import { SubmissionModel } from '../models/submission';
import { contextController } from '../controllers/context';
import { mailerController } from '../controllers/mailer';
import { AuthenticationError } from 'apollo-server-koa';
import { ObjectID } from 'bson';
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const saltRounds = 7;

const userResolver = {
  Mutation: {
    //public methods:

    signUpUser: async (root: any, args: any) => {
      const contactFound = await UserModel.findOne({
        email: args.input.email,
      });
      if (contactFound) {
        throw new Error('This user already exists');
      }
      //Store the password with a hash
      const hash: String = await bcrypt.hash(args.input.password, saltRounds);
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
      const token: String = jsonwebtoken.sign(
        {
          signUpUserID: newUser._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
      );
      console.log(token);

      const message: String = `Ha registrado este e-mail para crear una cuenta en el nuevo Bitbloq, si es así, pulse este link para confirmar su correo electrónico y activar su cuenta Bitbloq:
        <a href="${process.env.FRONTEND_URL}/app/activate?token=${token}">
          pulse aquí
        </a>
      `;
      //console.log(message);
      await mailerController.sendEmail(newUser.email, 'Sign Up ✔', message);
      await UserModel.findOneAndUpdate(
        { _id: newUser._id },
        { $set: { signUpToken: token } },
        { new: true },
      );
      //console.log(token);
      return 'OK';
    },

    login: async (root: any, { email, password }) => {
      const contactFound = await UserModel.findOne({ email });
      if (!contactFound) {
        throw new Error('Contact not found or password incorrect');
      }
      if (!contactFound.active) {
        throw new Error('Not active user, please activate your account');
      }
      //Compare passwords from request and database
      const valid: Boolean = await bcrypt.compare(
        password,
        contactFound.password,
      );
      if (valid) {
        const token: String = jsonwebtoken.sign(
          {
            email: contactFound.email,
            userID: contactFound._id,
          },
          process.env.JWT_SECRET,
        );
        UserModel.updateOne(
          { _id: contactFound._id },
          { $set: { authToken: token } },
        );
        return token;
      } else {
        throw new Error('comparing passwords valid=false');
      }
    },

    //private methods:

    activateAccount: async (root: any, args: any, context: any) => {
      if (!args.token)
        throw new Error('Error with sign up token, no token in args');
      const userInToken = await contextController.getDataInToken(args.token);
      const contactFound = await UserModel.findOne({
        _id: userInToken.signUpUserID,
      });
      if (userInToken.signUpUserID && !contactFound.active) {
        var token: String = jsonwebtoken.sign(
          {
            email: contactFound.email,
            userID: contactFound._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: '1h' },
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
        return new Error('Error with sign up token, try again');
      }
    },

    deleteUser: async (root: any, args: any, context: any) => {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      else if (!context.user.userID)
        throw new AuthenticationError('You need to be logged in');
      const contactFound = await UserModel.findOne({
        email: context.user.email,
      });
      if (contactFound._id == args.id) {
        await SubmissionModel.deleteMany({ user: contactFound._id });
        await ExerciseModel.deleteMany({ user: contactFound._id });
        await DocumentModel.deleteMany({ user: contactFound._id });
        return UserModel.deleteOne({ _id: contactFound._id }); //Delete every data of the user
      } else {
        throw new Error('Cant deleteUser');
      }
    },

    updateUser: async (root: any, args: any, context: any, input: any) => {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      else if (!context.user.userID)
        throw new AuthenticationError('You need to be logged in');
      const contactFound = await UserModel.findOne({
        email: context.user.email,
      });
      if (contactFound._id == args.id) {
        const data = args.input;
        return UserModel.updateOne({ _id: contactFound._id }, { $set: data });
      } else {
        return new Error('User does not exist');
      }
    },
  },

  Query: {
    me: async (root: any, args: any, context: any) => {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      else if (!context.user.userID)
        throw new AuthenticationError('You need to be logged in');
      const contactFound = await UserModel.findOne({
        email: context.user.email,
        _id: context.user.userID,
      });
      if (!contactFound) return new Error('Error with user in context');
      return contactFound;
    },
    users(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      else if (!context.user.userID)
        throw new AuthenticationError('You need to be logged in');
      return UserModel.find({});
    },
  },

  User: {
    documents: async user => DocumentModel.find({ user: user._id }),
  },
};

export default userResolver;
