import { AuthenticationError } from 'apollo-server-koa';
import { ExerciseModel } from '../models/exercise';
import { DocumentModel } from '../models/document';
import { ObjectId } from 'bson';

const exerciseResolver = {
  Mutation: {
    async createExercise(root: any, args: any, context: any) {
      if (!context.user.user_id)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const docFound = await DocumentModel.findOne({
        _id: args.input.document_father,
        user: context.user.user_id,
      });
      if (!docFound)
        throw new Error(
          'Error creating exercise, it should part of one of your documents',
        );
      const newCode=Math.random().toString(36).substr(2, 6);
      const exercise_new = new ExerciseModel({
        id: ObjectId,
        user: context.user.user_id,
        document_father: docFound._id,
        title: args.input.title,
        code: newCode,
        acceptSubmissions: args.input.acceptSubmissions,
        content: docFound.content,
        expireDate: args.input.expireDate,
      });
      return ExerciseModel.create(exercise_new);
      //return ExerciseModelController.createExercise(exerciseNew);
    },

    async changeSubmissionsState(root: any, args: any, context: any){
      if (!context.user.user_id)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const existExercise = await ExerciseModel.findOne({
        _id: args.id,
        user: context.user.user_id,
      });
      if (!existExercise) {
        return new Error('Exercise doesnt exist'); 
      }
      return ExerciseModel.findOneAndUpdate(
        { _id: existExercise._id },
        { $set:  {acceptSubmissions: args.subState} },
        { new: true },
      );
      //return ExerciseModelController.updateExercise(existExercise._id, {acceptSubmissions: args.subState});
    },

    deleteExercise(root: any, args: any, context: any) {
      if (!context.user.user_id)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');

      return ExerciseModel.deleteOne({ _id: args.id });
      // return ExerciseModelController.deleteExercise({
      //   id: args.id,
      //   code: args.code,
      // });
    },
    async updateExercise(root: any, args: any, context: any) {
      if (!context.user.user_id)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const existExercise = await ExerciseModel.findOne({
        _id: args.id,
        user: context.user.user_id,
      });
      if (existExercise) {
        return ExerciseModel.findOneAndUpdate(
          { _id: existExercise._id },
          { $set: args.input },
          { new: true },
        );
        //return ExerciseModelController.updateExercise(existExercise._id, args.input);
      } else {
        return new Error('Exercise doesnt exist');
      }
    },
  },
  Query: {
    async exercisesByDocument(root: any, args: any, context: any) {
      if (!context.user.user_id)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const documentFound = await DocumentModel.findOne({
        _id: args.document_father,
        user: context.user.user_id,
      });
      if (!documentFound) throw new Error('document doesnt exist');
      return ExerciseModel.find({ document_father: documentFound._id });
      //return ExerciseModelController.findExerciseByDocument(documentFound._id);
    },
    async exerciseByID(root: any, args: any, context: any) {
      if (!context.user.user_id)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      //const userFound = await UserModel.findOne({ email: context.user.email });
      return ExerciseModel.findOne({ _id: args.id });
      //return ExerciseModelController.findExerciseByID(args.id);
    },
    exercises(root: any, args: any, context: any) {
      if (!context.user.user_id)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      return ExerciseModel.find({});
        //return ExerciseModelController.findAllExercises();
    },
  },
};

export default exerciseResolver;
