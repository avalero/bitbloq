import { ApolloError } from "apollo-server-koa";
import { documentModel, IDocument } from "../models/document";
import { exerciseModel, IExercise } from "../models/exercise";
import { submissionModel } from "../models/submission";
import { IUser, userModel } from "../models/user";
import { pubsub } from "../server";
import { DOCUMENT_UPDATED } from "./document";
import { IUserInToken } from "../models/interfaces";
import {
  IMutationCreateExerciseArgs,
  IMutationChangeSubmissionsStateArgs,
  IMutationDeleteExerciseArgs,
  IMutationUpdateExerciseArgs,
  IQueryExerciseArgs,
  IQueryExerciseByCodeArgs,
  IQueryExercisesByDocumentArgs
} from "../api-types";

const exerciseResolver = {
  Mutation: {
    /**
     * Create exercise: create a new exercise with the content of the document father.
     * It stores the new exercise in the database with the document father information or new one provided by the user
     * args: exercise information
     */
    createExercise: async (
      _,
      args: IMutationCreateExerciseArgs,
      context: { user: IUserInToken }
    ) => {
      const docFather: IDocument = await documentModel.findOne({
        _id: args.input.document,
        user: context.user.userID
      });
      if (!docFather) {
        throw new ApolloError(
          "Error creating exercise, it should part of one of your documents",
          "DOCUMENT_NOT_FOUND"
        );
      }
      const user: IUser = await userModel.findById(context.user.userID);
      let newCode: string = Math.random()
        .toString(36)
        .substr(2, 6);
      while ((await exerciseModel.findOne({ code: newCode })) != null) {
        console.log("The exercise code already exists");
        newCode = Math.random()
          .toString(36)
          .substr(2, 6);
      }
      const exerciseNew: IExercise = new exerciseModel({
        user: context.user.userID,
        document: docFather._id,
        title: args.input.title,
        code: newCode,
        type: docFather.type,
        acceptSubmissions: args.input.acceptSubmissions,
        content: docFather.content,
        cache: docFather.cache,
        description: args.input.description || docFather.description,
        teacherName: user.name,
        expireDate: args.input.expireDate,
        image: docFather.image.image
      });
      const newEx: IExercise = await exerciseModel.create(exerciseNew);
      pubsub.publish(DOCUMENT_UPDATED, { documentUpdated: docFather });
      return newEx;
    },

    /**
     * Change Submission State: changes the value of the boolean acceptSubmissions.
     * args: exerciseID, new state of acceptSubmissions
     */
    changeSubmissionsState: async (
      _,
      args: IMutationChangeSubmissionsStateArgs,
      context: { user: IUserInToken }
    ) => {
      const existExercise: IExercise = await exerciseModel.findOne({
        _id: args.id,
        user: context.user.userID
      });
      if (!existExercise) {
        return new ApolloError("Exercise does not exist", "EXERCISE_NOT_FOUND");
      }

      return exerciseModel.findOneAndUpdate(
        { _id: existExercise._id },
        { $set: { acceptSubmissions: args.subState } },
        { new: true }
      );
    },

    /**
     * Delete exercise: delete one exercise of the user logged.
     * It deletes the exercise passed in the arguments if it belongs to the user logged.
     * This method deletes all the submissions related with the exercise ID.
     * args: exercise ID
     */
    deleteExercise: async (
      _,
      args: IMutationDeleteExerciseArgs,
      context: { user: IUserInToken }
    ) => {
      const existExercise: IExercise = await exerciseModel.findOne({
        _id: args.id,
        user: context.user.userID
      });
      if (existExercise) {
        await submissionModel.deleteMany({ exercise: existExercise._id });
        const docFather = await documentModel.findOne({
          _id: existExercise.document
        });
        pubsub.publish(DOCUMENT_UPDATED, { documentUpdated: docFather });
        return exerciseModel.deleteOne({ _id: args.id }); // delete all the exercise dependencies
      } else {
        return new ApolloError("Exercise does not exist", "EXERCISE_NOT_FOUND");
      }
    },

    /**
     * Update exercise: update existing exercise.
     * It updates the exercise with the new information provided.
     * args: exercise ID, new exercise information.
     */
    updateExercise: async (
      _,
      args: IMutationUpdateExerciseArgs,
      context: { user: IUserInToken }
    ) => {
      const existExercise: IExercise = await exerciseModel.findOne({
        _id: args.id,
        user: context.user.userID
      });
      if (existExercise) {
        return exerciseModel.findOneAndUpdate(
          { _id: existExercise._id },
          { $set: args.input },
          { new: true }
        );
      } else {
        return new ApolloError("Exercise does not exist", "EXERCISE_NOT_FOUND");
      }
    }
  },

  Query: {
    /**
     * Exercises: returns all the exercises of the user logged.
     * args: nothing.
     */
    exercises: async (_, context: { user: IUserInToken }) => {
      return exerciseModel.find({ user: context.user.userID });
    },

    /**
     * Exercise: returns the information of the exercise ID provided in the arguments.
     * It can be asked with the user logged token or the student token.
     * args: exercise ID.
     */
    exercise: async (_, args: IQueryExerciseArgs) => {
      if (!args.id || !args.id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApolloError("Invalid or missing id", "EXERCISE_NOT_FOUND");
      }
      const existExercise: IExercise = await exerciseModel.findOne({
        _id: args.id
      });
      if (!existExercise) {
        throw new ApolloError("Exercise does not exist", "EXERCISE_NOT_FOUND");
      }
      return existExercise;
    },

    /**
     * exerciseByCode: returns the information of the exercise code provided in the arguments.
     * It can be asked by anyone. It is the step previous to login in the exercise as student.
     * args: exercise code.
     */
    exerciseByCode: async (_, args: IQueryExerciseByCodeArgs) => {
      const existExercise: IExercise = await exerciseModel.findOne({
        code: args.code
      });
      if (!existExercise) {
        throw new ApolloError("Exercise does not exist", "EXERCISE_NOT_FOUND");
      }
      return existExercise;
    },

    /**
     * Exercises by document: returns all the exercises that depends on the document father ID passed in the arguments.
     * args: document ID.
     */
    exercisesByDocument: async (
      _,
      args: IQueryExercisesByDocumentArgs,
      context: { user: IUserInToken }
    ) => {
      const docFather: IDocument = await documentModel.findOne({
        _id: args.document,
        user: context.user.userID
      });
      if (!docFather) {
        throw new ApolloError("document does not exist", "DOCUMENT_NOT_FOUND");
      }
      return exerciseModel.find({
        document: docFather._id,
        user: context.user.userID
      });
    }
  },

  Exercise: {
    submissions: async (exercise: IExercise) =>
      submissionModel.find({ exercise: exercise._id })
  }
};

export default exerciseResolver;
