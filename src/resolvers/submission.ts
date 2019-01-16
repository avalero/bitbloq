import { AuthenticationError } from 'apollo-server-koa';
import { SubmissionModel } from '../models/submission';
import { ObjectId } from 'bson';
import { ExerciseModel } from '../models/exercise';
const jsonwebtoken = require('jsonwebtoken');

const submissionResolver = {
  Mutation: {
    //registrar nueva entrega: alumno que se une al aula
    async createSubmission(root: any, args: any, context: any) {
      const exercise = await ExerciseModel.findOne({
        code: args.exercise_code,
        acceptSubmissions: true,
      });
      if (!exercise)
        throw new Error('Error creating submission, check your exercise code');
      if (!exercise.acceptSubmissions) {
        throw new Error('This exercise doesnt accept submissions now');
      }
      if (await SubmissionModel.findOne({ student_nick: args.student_nick, exercise: exFather._id })) {
        throw new Error('This nick already exists in this exercise, try another one');
      }
      const submission_new = new SubmissionModel({
        id: ObjectId,
        exercise: exercise._id,
        student_nick: args.student_nick,
        content: exercise.content,
        teacher: exercise.user,
        title: exercise.title,
      });
      const newSub = await SubmissionModel.create(submission_new);
      const token: String = jsonwebtoken.sign(
        {
          exercise_id: exercise._id,
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
      return {
        token: token,
        submission_id: newSub._id,
        exercise_id: exercise._id,
        type: exercise.type
      };
    },

    async updateSubmission(root: any, args: any, context: any) {
      if (!context.user.exercise_id)
        throw new AuthenticationError('You need to login with exercise code');
      const existSubmission = await SubmissionModel.findOne({
        _id: context.user.submission_id,
        exercise: context.user.exercise_id,
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
        exercise: context.user.exercise_id,
      });
      if (!existSubmission) {
        throw new Error('Error finishing submission, it doesnt exist');
      }
      const exercise = await ExerciseModel.findOne({
        _id: existSubmission.exercise,
      });
      //check if the exercise accepts submissions
      if (!exercise.acceptSubmissions) {
        throw new Error('This exercise doesnt accept submissions now');
      }
      //check if the submission is in time
      const timeNow: Date = new Date();
      if (timeNow > exercise.expireDate) {
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
        exercise: context.user.exercise_id,
      });
      if (!existSubmission)
        throw new Error(
          'Error updating submission, it should part of one of your exercises',
        );
      return SubmissionModel.deleteOne({ _id: existSubmission._id });
    },
  },

  Query: {
    //Student and teacher querie:
    async submissionByID(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in as a teacher or as a student');
        
      if (context.user.submission_id){ //Token de alumno
        if(context.user.submission_id != args.id)
          throw new Error('You only can ask for your token submission');
        return SubmissionModel.findOne({ _id: context.user.submission_id });
      } else if(context.user.user_id){ //token de profesor
        return SubmissionModel.findOne({ _id: args.id, teacher: context.user.user_id });
      }
    },

    //teacher queries:
    async submissionsByExercise(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in as a teacher');
      else if(!context.user.user_id)
        throw new AuthenticationError('You need to be logged in as a teacher');
      const exerciseFound = await ExerciseModel.findOne({
        _id: args.exercise,
      });
      if (!exerciseFound) throw new Error('exercise doesnt exist');
      return SubmissionModel.find({ exercise: exerciseFound._id });
    },

    submissions(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in as a teacher');
      else if(!context.user.user_id)
        throw new AuthenticationError('You need to be logged in as a teacher');
      return SubmissionModel.find({});
    },
  },
};

export default submissionResolver;
