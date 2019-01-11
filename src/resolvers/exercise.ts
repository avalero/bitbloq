import { ExerciseModelController } from '../controllers/exercise';
import { AuthenticationError } from 'apollo-server-koa';
import { UserModel } from '../models/user';
import { ExerciseModel } from '../models/exercise';
import { DocumentModel } from '../models/document';
import { ObjectId } from 'bson';

const exerciseResolver = {
  Mutation: {
    async createExercise(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const docFound = await DocumentModel.findOne({
        _id: args.input.document_father,
        user: context.user.id,
      });
      if (!docFound)
        throw new Error(
          'Error creating exercise, it should part of one of your documents',
        );
      const newCode=Math.random().toString(36).substr(2, 6);
      const exerciseNew = new ExerciseModel({
        id: ObjectId,
        user: context.user.id,
        document_father: docFound._id,
        title: args.input.title,
        code: newCode,
        acceptSubmissions: args.input.acceptSubmissions,
        expireDate: args.input.expireDate,
      });
      return ExerciseModelController.createExercise(exerciseNew);
    },

    async changeSubmissionsState(root: any, args: any, context: any){
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const existExercise = await ExerciseModel.findOne({
        _id: args.id,
        user: context.user.id,
      });
      if (!existExercise) {
        return new Error('Exercise doesnt exist'); 
      }
      return ExerciseModelController.updateExercise(existExercise._id, {acceptSubmissions: args.subState});
    },

    deleteExercise(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');

      return ExerciseModelController.deleteExercise({
        id: args.id,
        code: args.code,
      });
    },
    async updateExercise(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const existExercise = await ExerciseModel.findOne({
        _id: args.id,
        user: context.user.id,
      });
      if (existExercise) {
        return ExerciseModelController.updateExercise(existExercise._id, args.input);
      } else {
        return new Error('Exercise doesnt exist');
      }
    },
  },
  Query: {
    async exercisesByDocument(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const documentFound = await DocumentModel.findOne({
        _id: args.document_father,
        user: context.user.id,
      });
      if (!documentFound) throw new Error('document doesnt exist');
      return ExerciseModelController.findExerciseByDocument(documentFound._id);
    },
    async exerciseByID(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      //const userFound = await UserModel.findOne({ email: context.user.email });
      return ExerciseModelController.findExerciseByID(args.id);
    },
    exercises(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      return ExerciseModelController.findAllExercises();
    },
  },
};

export default exerciseResolver;
