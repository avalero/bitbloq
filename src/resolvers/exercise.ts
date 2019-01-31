import { AuthenticationError, ApolloError } from 'apollo-server-koa';
import { ExerciseModel } from '../models/exercise';
import { DocumentModel } from '../models/document';
import { ObjectId } from 'bson';
import { SubmissionModel } from '../models/submission';
import { UserModel } from '../models/user';

const exerciseResolver = {
  Mutation: {
    createExercise: async (root: any, args: any, context: any) => {
      const docFather = await DocumentModel.findOne({
        _id: args.input.document,
        user: context.user.userID,
      });
      if (!docFather)
        throw new ApolloError(
          'Error creating exercise, it should part of one of your documents',
          'DOCUMENT_NOT_FOUND',
        );
      const user = await UserModel.findById(context.user.userID);
      const newCode = Math.random()
        .toString(36)
        .substr(2, 6);
      const exerciseNew = new ExerciseModel({
        id: ObjectId,
        user: context.user.userID,
        document: docFather._id,
        title: args.input.title,
        code: newCode,
        type: docFather.type,
        acceptSubmissions: args.input.acceptSubmissions,
        content: docFather.content,
        description: args.input.description || docFather.description,
        teacherName: user.name,
        expireDate: args.input.expireDate,
        image: docFather.image,
      });
      return ExerciseModel.create(exerciseNew);
    },

    changeSubmissionsState: async (root: any, args: any, context: any) => {
      const existExercise = await ExerciseModel.findOne({
        _id: args.id,
        user: context.user.userID,
      });
      if (!existExercise) {
        return new ApolloError('Exercise does not exist', 'EXERCISE_NOT_FOUND');
      }
      return ExerciseModel.findOneAndUpdate(
        { _id: existExercise._id },
        { $set: { acceptSubmissions: args.subState } },
        { new: true },
      );
    },

    deleteExercise: async (root: any, args: any, context: any) => {
      const existExercise = await ExerciseModel.findOne({
        _id: args.id,
        user: context.user.userID,
      });
      if (existExercise) {
        await SubmissionModel.deleteMany({ exercise: existExercise._id });
        return ExerciseModel.deleteOne({ _id: args.id }); //delete all the exercise dependencies
      } else {
        return new ApolloError('Exercise does not exist', 'EXERCISE_NOT_FOUND');
      }
    },

    updateExercise: async (root: any, args: any, context: any) => {
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
        return new ApolloError('Exercise does not exist', 'EXERCISE_NOT_FOUND');
      }
    },
  },

  Query: {
    //devuelve todos los ejercicios del usuario logeado
    exercises: async (root: any, args: any, context: any) => {
      return ExerciseModel.find({ user: context.user.userID });
    },

    //student and user query, devuelve la información del ejercicio que se le pasa en el id con el tocken del alumno o de usuario
    exercise: async (root: any, args: any, context: any) => {
      if (context.user.exerciseID) {
        //Token de alumno
        if (context.user.exerciseID != args.id)
          throw new ApolloError(
            'You only can ask for your token exercise',
            'NOT_YOUR_EXERCISE',
          );
        const existExercise = await ExerciseModel.findOne({
          _id: context.user.exerciseID,
        });
        if (!existExercise) {
          throw new ApolloError(
            'Exercise does not exist',
            'EXERCISE_NOT_FOUND',
          );
        }
        return existExercise;
      } else if (context.user.userID) {
        //token de profesor
        const existExercise = await ExerciseModel.findOne({
          _id: args.id,
          user: context.user.userID,
        });
        if (!existExercise) {
          throw new ApolloError(
            'Exercise does not exist',
            'EXERCISE_NOT_FOUND',
          );
        }
        return existExercise;
      }
    },

    exercisesByDocument: async (root: any, args: any, context: any) => {
      const docFather = await DocumentModel.findOne({
        _id: args.document,
        user: context.user.userID,
      });
      if (!docFather)
        throw new ApolloError('document does not exist', 'DOCUMENT_NOT_FOUND');
      const existExercise = await ExerciseModel.find({
        document: docFather._id,
        user: context.user.userID,
      });
      return existExercise;
    },
  },

  Exercise: {
    submissions: async exercise =>
      SubmissionModel.find({ exercise: exercise._id }),
  },
};

export default exerciseResolver;
