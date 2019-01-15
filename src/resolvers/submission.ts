import { AuthenticationError } from 'apollo-server-koa';
import { SubmissionModel } from '../models/submission';
import { ObjectId } from 'bson';
import { ExerciseModel } from '../models/exercise';
const jsonwebtoken = require('jsonwebtoken');

const submissionResolver = {
  Mutation: {
    //registrar nueva entrega: alumno que se une al aula
    async createSubmission(root: any, args: any, context: any) {
      const exFather = await ExerciseModel.findOne({
        code: args.exercise_code,
        acceptSubmissions: true,
      });
      console.log(args);
      console.log(exFather);
      if (!exFather)
        throw new Error('Error creating submission, check your exercise code');
      if (!exFather.acceptSubmissions) {
        throw new Error('This exercise doesnt accept submissions now');
      }
      const submission_new = new SubmissionModel({
        id: ObjectId,
        exercise_father: exFather._id,
        student_nick: args.student_nick,
        content: exFather.content,
        teacher: exFather.user,
      });
      const newSub = await SubmissionModel.create(submission_new);
      const token: String = jsonwebtoken.sign(
        {
          exercise_id: exFather._id,
          submission_id: newSub._id,
          student_nick: args.student_nick,
        },
        process.env.JWT_SECRET,
        { expiresIn: '3h' },
      );
      await SubmissionModel.findOneAndUpdate(
        { _id: newSub._id },
        { $set: { sub_token: token } },
        { new: true },
      );
      return token;
    },

    async updateSubmission(root: any, args: any, context: any) {
      if (!context.user.exercise_id)
        throw new AuthenticationError('You need to login with exercise code');
      const existSubmission = await SubmissionModel.findOne({
        _id: context.user.submission_id,
        exercise_father: context.user.exercise_id,
      });
      if (!existSubmission)
        throw new Error(
          'Error updating submission, it should part of one of your exercises',
        );
      if (existSubmission.finished) {
        throw new Error('You already finished the exercise');
      }
      if (existSubmission) {
        return SubmissionModel.findOneAndUpdate(
          { _id: existSubmission._id },
          { $set: args.input },
          { new: true },
        );
      } else {
        return new Error('Exercise doesnt exist');
      }
    },

    async finishSubmission(root: any, args: any, context: any) {
      if (!context.user.exercise_id)
        throw new AuthenticationError(
          'You need to be logged in with exercise code',
        );
      const existSubmission = await SubmissionModel.findOne({
        _id: context.user.submission_id,
        exercise_father: context.user.exercise_id,
      });
      if (!existSubmission) {
        throw new Error('Error finishing submission, it doesnt exist');
      }
      const exFather = await ExerciseModel.findOne({
        _id: existSubmission.exercise_father,
      });
      //check if the exercise accepts submissions
      if (!exFather.acceptSubmissions) {
        throw new Error('This exercise doesnt accept submissions now');
      }
      //check if the submission is in time
      const timeNow: Date = new Date();
      if (timeNow > exFather.expireDate) {
        throw new Error('Your submission is late');
      }
      return SubmissionModel.findOneAndUpdate(
        { _id: existSubmission._id },
        { $set: { finished: true, comment: args.comment } },
        { new: true },
      );
    },

    async deleteSubmission(root: any, args: any, context: any) {
      if (!context.user.exercise_id)
        throw new AuthenticationError(
          'You need to be logged in with exercise code',
        );
      const existSubmission = await SubmissionModel.findOne({
        _id: context.user.submission_id,
        exercise_father: context.user.exercise_id,
      });
      if (!existSubmission)
        throw new Error(
          'Error updating submission, it should part of one of your exercises',
        );
      return SubmissionModel.deleteOne({ _id: existSubmission._id });
    },
  },

  Query: {
    async submissionsByExercise(root: any, args: any, context: any) {
      if (!context.user.user_id)
        throw new AuthenticationError(
          'You need to be logged in. Only teachers',
        );
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const exerciseFound = await ExerciseModel.findOne({
        _id: args.exercise_father,
      });
      if (!exerciseFound) throw new Error('exercise doesnt exist');
      return SubmissionModel.find({ exercise_father: exerciseFound._id });
    },

    async submissionByID(root: any, args: any, context: any) {
      if (!context.user.user_id)
        throw new AuthenticationError(
          'You need to be logged in. Only teachers',
        );
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      return SubmissionModel.findOne({ _id: args.id });
    },

    submissions(root: any, args: any, context: any) {
      if (!context.user.user_id)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      return SubmissionModel.find({});
    },
  },
};

export default submissionResolver;
