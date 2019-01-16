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

    async signUpUser(root: any, args: any) {
      console.log(args);
      const contactFound = await UserModel.findOne({
        email: args.input.email,
      });
      if (contactFound) {
        throw new Error('This user already exists');
      }
      //Store the password with a hash
      const hash: String = await bcrypt.hash(args.input.password, saltRounds);
      const token: String = jsonwebtoken.sign(
        {
          email: args.input.email,
          password: hash,
          signUp: true,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
      );
      const user_new = new UserModel({
        id: ObjectID,
        email: args.input.email,
        password: hash,
        name: args.input.name,
        center: args.input.center,
        active: false,
        signUpToken: token,
        authToken: ' ',
        notifications: args.input.notifications,
        signUpSurvey: args.input.signUpSurvey,
      });
      console.log(token);
      const newUser = await UserModel.create(user_new);
      // mensaje del email: Y el link debe mandar a: ${url_del_servidor}/activate/${token_de_signup} -> http://localhost:4000/activate/token
      const message: String =
        'Ha registrado este e-mail para crear una cuenta en el nuevo Bitbloq, si es así, pulse este link para confirmar su correo electrónico y activar su cuenta Bitbloq: ' +
        process.env.SERVER_URL +
        process.env.PORT +
        '/activate/' +
        token;
      console.log(message);
      await mailerController.sendEmail(newUser.email, 'Sign Up ✔', message);
      return token;
    },

    async login(root: any, { email, password }) {
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
            user_id: contactFound._id,
            signUp: false,
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

    async activateAccount(root: any, args: any, context: any) {
      if (!args.token)
        throw new Error('Error with sign up token, no token in args');
      const userInToken = await contextController.getDataInToken(args.token);
      const contactFound = await UserModel.findOne({
        email: userInToken.email,
      });
      if (userInToken.signUp && !contactFound.active) {
        var token: String = jsonwebtoken.sign(
          {
            email: contactFound.email,
            user_id: contactFound._id,
            signUp: false,
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

    async deleteUser(root: any, args: any, context: any) {
      if (!context.user.user_id)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const contactFound = await UserModel.findOne({
        email: context.user.email,
      });
      if (contactFound._id == args.id) {
        await SubmissionModel.deleteMany({ teacher: contactFound._id });
        await ExerciseModel.deleteMany({ user: contactFound._id });
        await DocumentModel.deleteMany({ user: contactFound._id });
        return UserModel.deleteOne({ _id: contactFound._id }); //Delete every data of the user
      } else {
        throw new Error('Cant deleteUser');
      }
    },

    async updateUser(root: any, args: any, context: any, input: any) {
      if (!context.user.user_id)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const contactFound = await UserModel.findOne({
        email: context.user.email,
      });
      if (contactFound._id == args.id) {
        const data = args.input;
        return UserModel.updateOne({ _id: contactFound._id }, { $set: data });
      } else {
        return new Error('User doesnt exist');
      }
    },
  },

  Query: {
    async me(root: any, args: any, context: any) {
      console.log(context);
      if (!context.user.user_id)
        throw new AuthenticationError('You need to be logged in');
      const contactFound = await UserModel.findOne({
        email: context.user.email,
        _id: context.user.user_id,
      });
      if (!contactFound) return new Error('Error with user in context');
      return contactFound;
    },
    users(root: any, args: any, context: any) {
      console.log(context);
      if (!context.user.user_id)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      return UserModel.find({});
    },
  },
};

export default userResolver;
