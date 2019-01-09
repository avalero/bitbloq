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
      const exFound = await ExerciseModel.findOne({
        _id: args.input.exercise_father,
        user: context.user.id,
      });
      if (!exFound)
        throw new Error(
          'Error creating submission, it should part of one of your exercises',
        );
      const submissionNew = new SubmissionModel({
        id: ObjectId,
        exercise_father: exFound._id,
        user: exFound.user,
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
      const existSubmission = await SubmissionModel.findOne({
        _id: args.id,
        user: context.user.id,
      });
      if (!existSubmission)
        throw new Error(
          'Error updating submission, it should part of one of your exercises',
        );
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
      const existSubmission = await SubmissionModel.findOne({
        _id: args.id,
        user: context.user.id,
      });
      if (!existSubmission)
        throw new Error(
          'Error updating submission, it should part of one of your exercises',
        );
      return SubmissionModelController.finishSubmission(existSubmission._id);
    },
    async deleteSubmission(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const existSubmission = await SubmissionModel.findOne({
        _id: args.id,
        user: context.user.id,
      });
      if (!existSubmission)
        throw new Error(
          'Error updating submission, it should part of one of your exercises',
        );
      return SubmissionModelController.deleteSubmission(existSubmission._id);
    },
  },
  Query: {
    async submissionsByExercise(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const exerciseFound = await ExerciseModel.findOne({
        _id: args.exercise_father,
        user: context.user.id,
      });
      if (!exerciseFound) throw new Error('exercise doesnt exist');
      return SubmissionModelController.findSubmissionByExercise(
        exerciseFound._id,
      );
    },
    async submissionByID(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      //const userFound = await UserModel.findOne({ email: context.user.email });
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
