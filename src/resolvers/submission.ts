import { SubmissionModelController } from '../controllers/submission';
import { AuthenticationError } from 'apollo-server-koa';
import { UserModel } from '../models/user';
import { SubmissionModel } from '../models/submission';
import { DocumentModel } from '../models/document';
import { ObjectId } from 'bson';
import { ExerciseModel } from '../models/exercise';

const submissionResolver = {
  Mutation: {
    async createSubmission(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const userFinded = await UserModel.findOne({ email: context.user.email });
      const submissionNew = new SubmissionModel({
        id: ObjectId,
        exercise_father: args.input.exercise_father,
        title: args.input.title,
        student_nick: args.input.student_nick,
        comment: args.input.comment,
      });
      return SubmissionModelController.createSubmission(submissionNew);
    },
    async updateSubmission(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const existSubmission = await SubmissionModel.findOne({ _id: args.id });
      if (existSubmission) {
        return SubmissionModelController.updateSubmission(
          existSubmission._id,
          args,
        );
      } else {
        return new Error('Exercise doesnt exist');
      }
    },
    async finishSubmission(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const existSubmission = await SubmissionModel.findOne({ _id: args.id });
      return SubmissionModelController.finishSubmission(existSubmission._id);
    },
    deleteSubmission(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');

      return SubmissionModelController.deleteSubmission(args.id);
    },
  },
  Query: {
    async submissionsByExercise(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const exerciseFinded = await ExerciseModel.findOne({
        _id: args.exercise_father,
      });
      if (!exerciseFinded) throw new Error('exercise doesnt exist');
      return SubmissionModelController.findSubmissionByExercise(
        exerciseFinded._id,
      );
    },
    async submissionByID(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      //const userFinded = await UserModel.findOne({ email: context.user.email });
      return SubmissionModelController.findSubmissionByID(args.id);
    },
    submissions(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      return SubmissionModelController.findAllSubmissions();
    },
  },
};

export default submissionResolver;
