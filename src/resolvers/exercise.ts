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
      const userFinded = await UserModel.findOne({ email: context.user.email });
      const exerciseNew = new ExerciseModel({
        id: ObjectId,
        document_father: args.input.document_father,
        title: args.input.title,
        expireDate: args.input.expireDate,
      });
      return ExerciseModelController.createExercise(exerciseNew);
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
      const existExercise = await ExerciseModel.findOne({ _id: args.id });
      if (existExercise) {
        return ExerciseModelController.updateExercise(existExercise._id, args);
      } else {
        return new Error('Exercise doesnt exist');
      }
    },

    createSubmission(root: any, args: any) {
      return ExerciseModelController.createSubmission(root, args);
    },
    updateSubmission(root: any, args: any) {
      return ExerciseModelController.updateSubmission(root, args);
    },
    finishSubmission(root: any, args: any) {
      return ExerciseModelController.finishSubmission(root, args);
    },
    deleteSubmission(root: any, args: any) {
      return ExerciseModelController.finishSubmission(root, args);
    },
  },
  Query: {
    async exercisesByDocument(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      console.log(args.document_father);
      const documentFinded = await DocumentModel.findOne({
        _id: args.document_father,
      });
      console.log(documentFinded);
      if (!documentFinded) throw new Error('document doesnt exist');
      return ExerciseModelController.findExerciseByDocument(documentFinded._id);
    },
    async exerciseByID(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      //const userFinded = await UserModel.findOne({ email: context.user.email });
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
