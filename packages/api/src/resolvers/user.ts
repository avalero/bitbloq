import { ApolloError, AuthenticationError } from "apollo-server-koa";
import { contextController } from "../controllers/context";
import { mailerController } from "../controllers/mailer";
import { documentModel, IDocument } from "../models/document";
import { exerciseModel } from "../models/exercise";
import { FolderModel, IFolder } from "../models/folder";
import { submissionModel } from "../models/submission";
import { IUser, userModel } from "../models/user";

import {
  IEmailData,
  IResetPasswordToken,
  ISignUpToken,
  IUserInToken
} from "../models/interfaces";

import * as mjml2html from "mjml";
import { resetPasswordTemplate } from "../email/resetPasswordMail";
import { welcomeTemplate } from "../email/welcomeMail";

import { redisClient } from "../server";

import { sign as jwtSign } from "jsonwebtoken";
import { hash as bcryptHash, compare as bcryptCompare } from "bcrypt";
import {
  MutationSignUpUserArgs,
  MutationActivateAccountArgs,
  MutationDeleteUserArgs,
  MutationUpdateUserArgs
} from "../generated/graphql";

const saltRounds = 7;

const userResolver = {
  Mutation: {
    // Public mutations:

    /**
     * Save user: register the data of a new uer.
     * It saves the new user data if the email passed as argument is not registered yet.
     * args: email, password and user information.
     */
    saveUserData: async (root: any, args: any) => {
      const contactFound: IUser = await UserModel.findOne({
        email: args.input.email
      });
      if (contactFound) {
        if (contactFound.finishedSignUp) {
          throw new ApolloError(
            "This user already exists",
            "USER_EMAIL_EXISTS"
          );
        } else {
          await UserModel.deleteOne({ _id: contactFound._id }); // Delete every data of the user
        }
      }
      // Store the password with a hash
      const hash: string = await bcryptHash(args.input.password, saltRounds);
      const birthDate: number[] = args.input.birthDate.split("/");
      const userNew: IUser = new UserModel({
        email: args.input.email,
        password: hash,
        name: args.input.name,
        surnames: args.input.surnames,
        birthDate: new Date(birthDate[2], birthDate[1] - 1, birthDate[0]),
        active: false,
        authToken: " ",
        notifications: args.input.notifications,
        imTeacherCheck: args.input.imTeacherCheck,
        centerName: args.input.centerName,
        educationalStage: args.input.educationalStage,
        province: args.input.province,
        postCode: args.input.postCode,
        country: args.input.country,
        lastLogin: new Date(),
        finishedSignUp: false
      });
      const newUser: IUser = await UserModel.create(userNew);
      return { id: newUser._id, email: newUser.email };
    },

    /**
     * Finish sign up: checks if the user id passed as argument is registered in platform
     * and update the user plan.
     * It sends a e-mail to activate the account.
     * args: userID and plan selected("member" or "teacher").
     */
    finishSignUp: async (root: any, args: any) => {
      const user: IUser = await UserModel.findOne({
        _id: args.id,
        active: false
      });
      if (!user) {
        return new ApolloError(
          "User does not exist or activated.",
          "USER_NOT_FOUND"
        );
      }
      let teacher: boolean = false;
      switch (args.userPlan) {
        case "teacher":
          teacher = true;
          break;
        case "member":
          break;
        default:
          throw new ApolloError("User plan is not valid", "PLAN_NOT_FOUND");
      }
      const signUpToken: string = jwtSign(
        {
          signUpUserID: user._id
        },
        process.env.JWT_SECRET
      );

      // Generate the email with the activation link and send it
      const data: IEmailData = {
        url: `${process.env.FRONTEND_URL}/app/activate?token=${signUpToken}`
      };
      const mjml: string = welcomeTemplate(data);
      const htmlMessage: any = mjml2html(mjml, {
        keepComments: false,
        beautify: true,
        minify: true
      });
      await mailerController.sendEmail(
        user.email,
        "Bitbloq Sign Up ✔",
        htmlMessage.html
      );

      // Create user root folder for documents
      const userFolder: IFolder = await FolderModel.create({
        name: "root",
        user: user._id
      });
      // Update the user information in the database
      await UserModel.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            signUpToken,
            teacher,
            finishedSignUp: true,
            rootFolder: userFolder._id
          }
        },
        { new: true }
      );
      return "OK";
    },

    /*
      Login: login with a registered user.
      It returns the authorization token with user information.
      args: email and password.
    */
    login: async (root: any, { email, password }) => {
      const contactFound: IUser = await UserModel.findOne({
        email,
        finishedSignUp: true
      });
      if (!contactFound) {
        throw new AuthenticationError("Email or password incorrect");
      }
      if (!contactFound.active) {
        throw new ApolloError(
          "Not active user, please activate your account",
          "NOT_ACTIVE_USER"
        );
      }
      // Compare passwords from request and database
      const valid: boolean = await bcryptCompare(
        password,
        contactFound.password
      );
      if (valid) {
        const { token, role } = await contextController.generateLoginToken(
          contactFound
        );
        if (!contactFound.rootFolder) {
          const userDocs: IDocument[] = await documentModel.find({
            user: contactFound._id
          });
          const userFols: IFolder[] = await FolderModel.find({
            user: contactFound._id
          });
          const userFolder: IFolder = await FolderModel.create({
            name: "root",
            user: contactFound._id,
            documentsID: userDocs.map(i => i._id),
            foldersID: userFols.map(i => i._id)
          });
          await documentModel.updateMany(
            { user: contactFound._id },
            { $set: { folder: userFolder._id } }
          );
          await FolderModel.updateMany(
            { user: contactFound._id, name: { $ne: "root" } },
            { $set: { parent: userFolder._id } }
          );
          await userModel.updateOne(
            { _id: contactFound._id },
            { $set: { rootFolder: userFolder._id } },
            { new: true }
          );
        }

        // Update the user information in the database
        await userModel.updateOne(
          { _id: contactFound._id },
          { $set: { authToken: token, lastLogin: new Date() } },
          { new: true }
        );
        await storeTokenInRedis(`authToken-${contactFound._id}`, token);
        return token;
      } else {
        throw new AuthenticationError("Email or password incorrect");
      }
    },

    /*
     * renewToken: returns a new token for a logged user
     */
    renewToken: async (context: any) => {
      let oldToken = "";
      if (context.headers && context.headers.authorization) {
        oldToken = context.headers.authorization.split(" ")[1];
      }

      const { data, token } = await contextController.generateNewToken(
        oldToken
      );
      if (data.userID) {
        await storeTokenInRedis(`authToken-${data.userID}`, token);
      } else if (data.submissionID) {
        await storeTokenInRedis(`subToken-${data.submissionID}`, token);
      }
      return token;
    },

    /**
     * reset Password: send a email to the user email with a new token for edit the password.
     * args: email
     */
    resetPasswordEmail: async (root: any, { email }) => {
      const contactFound: IUser = await UserModel.findOne({
        email,
        finishedSignUp: true
      });
      if (!contactFound) {
        throw new AuthenticationError("The email does not exist.");
      }
      const token: string = jwtSign(
        {
          resetPassUserID: contactFound._id
        },
        process.env.JWT_SECRET,
        { expiresIn: "30m" }
      );
      await storeTokenInRedis(`resetPasswordToken-${contactFound._id}`, token);

      // Generate the email with the activation link and send it
      const data: IEmailData = {
        url: `${process.env.FRONTEND_URL}/reset-password?token=${token}`
      };
      const mjml = resetPasswordTemplate(data);
      const htmlMessage = mjml2html(mjml, {
        keepComments: false,
        beautify: true,
        minify: true
      });
      await mailerController.sendEmail(
        contactFound.email,
        "Cambiar contraseña Bitbloq",
        htmlMessage.html
      );
      return "OK";
    },

    checkResetPasswordToken: async ({ token }) => {
      await getResetPasswordData(token);
      return true;
    },

    /**
     * edit Password: stores the new password passed as argument in the database
     * You can only use this method if the token provided is the one created in the resetPasswordEmail mutation
     * args: token, new Password
     */
    updatePassword: async ({ token, newPassword }) => {
      const dataInToken = await getResetPasswordData(token);

      const contactFound: IUser = await UserModel.findOne({
        _id: dataInToken.resetPassUserID,
        finishedSignUp: true
      });

      if (!contactFound) {
        throw new ApolloError(
          "Error with reset password token",
          "USER_NOT_FOUND"
        );
      }
      // Store the password with a hash
      const hash: string = await bcryptHash(newPassword, saltRounds);
      const {
        token: authToken,
        role
      } = await contextController.generateLoginToken(contactFound);

      await userModel.findOneAndUpdate(
        { _id: contactFound._id },
        {
          $set: {
            password: hash,
            authToken: authToken
          }
        }
      );

      if (process.env.USE_REDIS === "true") {
        redisClient.del(`resetPasswordToken-${contactFound._id}`);
      }

      await storeTokenInRedis(`authToken-${contactFound._id}`, authToken);
      return authToken;
    },

    /*
      Activate Account: activates the new account of the user registered.
      It takes the information of the token received and activates the account created before.
      args: sign up token. This token is provided in the email sent.
    */
    activateAccount: async (args: MutationActivateAccountArgs) => {
      if (!args.token) {
        throw new ApolloError(
          "Error with sign up token, no token in args",
          "NOT_TOKEN_PROVIDED"
        );
      }
      const userInToken: ISignUpToken = await contextController.getDataInToken(
        args.token
      );

      const contactFound: IUser = await UserModel.findOne({
        _id: userInToken.signUpUserID,
        finishedSignUp: true
      });
      if (userInToken.signUpUserID && !contactFound.active) {
        const { token } = await contextController.generateLoginToken(
          contactFound
        );
        await userModel.findOneAndUpdate(
          { _id: contactFound._id },
          {
            $set: {
              active: true,
              authToken: token,
              signUpToken: " "
            }
          }
        );
        await storeTokenInRedis(`authToken-${contactFound._id}`, token);
        return token;
      } else {
        return new ApolloError(
          "Error with sign up token, try again",
          "TOKEN_NOT_VALUE"
        );
      }
    },

    /**
     * Delete user: delete own user.
     * It deletes the user passed by the ID if it is the same as the passed by token.
     * This method deletes all the documents, exercises and submissions related with this user.
     * args: user ID.
     */
    deleteUser: async (
      args: MutationDeleteUserArgs,
      context: { user: IUserInToken }
    ) => {
      const contactFound: IUser = await userModel.findOne({
        email: context.user.email,
        _id: context.user.userID,
        finishedSignUp: true
      });
      if (String(contactFound._id) === args.id) {
        await submissionModel.deleteMany({ user: contactFound._id });
        await exerciseModel.deleteMany({ user: contactFound._id });
        await documentModel.deleteMany({ user: contactFound._id });
        await FolderModel.deleteMany({ user: contactFound._id });
        return userModel.deleteOne({ _id: contactFound._id }); // Delete every data of the user
      } else {
        throw new ApolloError(
          "Can not delete a user that is not yours",
          "DELETE_USER_ERROR"
        );
      }
    },

    /*
      Update user: update existing user.
      It updates the user with the new information provided.
      args: user ID, new user information.
    */
    updateUser: async (
      args: MutationUpdateUserArgs,
      context: { user: IUserInToken }
    ) => {
      const contactFound: IUser = await userModel.findOne({
        email: context.user.email,
        _id: context.user.userID,
        finishedSignUp: true
      });
      if (String(contactFound._id) === args.id) {
        return await userModel.findOneAndUpdate(
          { _id: contactFound._id },
          { $set: args.input },
          { new: true }
        );
      } else {
        return new ApolloError("User does not exist", "USER_NOT_FOUND");
      }
    }
  },

  Query: {
    /**
     *  Me: returns the information of the user provided in the authorization token.
     *  args: nothing.
     */
    me: async (context: { user: IUserInToken }) => {
      const contactFound: IUser = await userModel.findOne({
        email: context.user.email,
        _id: context.user.userID
      });
      if (!contactFound) {
        return new ApolloError("Error with user in context", "USER_NOT_FOUND");
      }
      return contactFound;
    },

    /**
     *  Users: returns all the users in the platform. It can be executed only by admin user.
     *  args: nothing.
     */
    users() {
      return userModel.find({});
    }
  },

  User: {
    documents: async (user: IUser) => documentModel.find({ user: user._id })
  }
};

const storeTokenInRedis = (id: string, token: string) => {
  if (process.env.USE_REDIS === "true") {
    return redisClient.set(String(id), token, (err, reply) => {
      if (err) {
        throw new ApolloError(
          "Error storing auth token in redis",
          "REDIS_TOKEN_ERROR"
        );
      }
    });
  }
};

const getResetPasswordData = async (token: string) => {
  if (!token) {
    throw new ApolloError(
      "Error with reset password token, no token in args",
      "INVALID_TOKEN"
    );
  }
  let dataInToken: IResetPasswordToken;

  try {
    dataInToken = await contextController.getDataInToken(token);
  } catch (e) {
    throw new ApolloError(
      "The provided token is not valid or has expired",
      "INVALID_TOKEN"
    );
  }

  if (process.env.USE_REDIS === "true") {
    const storedToken = await redisClient.getAsync(
      `resetPasswordToken-${dataInToken.resetPassUserID}`
    );
    if (storedToken !== token) {
      throw new ApolloError(
        "The provided token is not the latest one",
        "INVALID_TOKEN"
      );
    }
  }

  return dataInToken;
};

export default userResolver;
