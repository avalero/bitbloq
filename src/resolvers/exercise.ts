import { AuthenticationError } from 'apollo-server-koa';
import { ExerciseModel } from '../models/exercise';
import { DocumentModel } from '../models/document';
import { ObjectId } from 'bson';

const exerciseResolver = {
  Mutation: {
    async createExercise(root: any, args: any, context: any) {
      if (!context.user.userID)
        throw new AuthenticationError('You need to be logged in');
      const docFound = await DocumentModel.findOne({
        _id: args.input.document,
        user: context.user.userID,
      });
      if (!docFound)
        throw new Error(
          'Error creating exercise, it should part of one of your documents',
        );
      const newCode = Math.random()
        .toString(36)
        .substr(2, 6);
      const exerciseNew = new ExerciseModel({
        id: ObjectId,
        user: context.user.userID,
        document: docFound._id,
        title: args.input.title,
        code: newCode,
        type: docFound.type,
        acceptSubmissions: args.input.acceptSubmissions,
        content: docFound.content,
        expireDate: args.input.expireDate,
      });
      return ExerciseModel.create(exerciseNew);
      //return ExerciseModelController.createExercise(exerciseNew);
    },

    async changeSubmissionsState(root: any, args: any, context: any) {
      if (!context.user.userID)
        throw new AuthenticationError('You need to be logged in');
      const existExercise = await ExerciseModel.findOne({
        _id: args.id,
        user: context.user.userID,
      });
      if (!existExercise) {
        return new Error('Exercise doesnt exist');
      }
      return ExerciseModel.findOneAndUpdate(
        { _id: existExercise._id },
        { $set: { acceptSubmissions: args.subState } },
        { new: true },
      );
    },

    deleteExercise(root: any, args: any, context: any) {
      if (!context.user.userID)
        throw new AuthenticationError('You need to be logged in');

      return ExerciseModel.deleteOne({ _id: args.id });
    },

    async updateExercise(root: any, args: any, context: any) {
      if (!context.user.userID)
        throw new AuthenticationError('You need to be logged in');
      const existExercise = await ExerciseModel.findOne({
        _id: args.id,
        user: context.user.userID,
      });
      if (existExercise) {
        return ExerciseModel.findOneAndUpdate(
          { _id: existExercise._id },
          { $set: args.input },
          { new: true },
        );
      } else {
        return new Error('Exercise doesnt exist');
      }
    },
  },

  Query: {
    async exercisesByDocument(root: any, args: any, context: any) {
      if (!context.user.userID)
        throw new AuthenticationError('You need to be logged in');
      const documentFound = await DocumentModel.findOne({
        _id: args.document,
        user: context.user.userID,
      });
      if (!documentFound) throw new Error('document doesnt exist');
      return ExerciseModel.find({ document: documentFound._id });
    },

    async exerciseByID(root: any, args: any, context: any) {
      if (!context.user.userID)
        throw new AuthenticationError('You need to be logged in');
      return ExerciseModel.findOne({ _id: args.id });
    },

    exercises(root: any, args: any, context: any) {
      if (!context.user.userID)
        throw new AuthenticationError('You need to be logged in');
      return ExerciseModel.find({user: context.user.userID});
    },
  },
};

export default exerciseResolver;
