import { AuthenticationError } from 'apollo-server-koa';
import { SubmissionModel } from '../models/submission';
import { ObjectId } from 'bson';
import { ExerciseModel } from '../models/exercise';
const jsonwebtoken = require('jsonwebtoken');

const submissionResolver = {
  Mutation: {
    //registrar nueva entrega: alumno que se une al aula
    createSubmission: async (root: any, args: any, context: any) => {
      const exFather = await ExerciseModel.findOne({
        code: args.exerciseCode,
        acceptSubmissions: true,
      });
      if (!exFather)
        throw new Error('Error creating submission, check your exercise code');
      if (!exFather.acceptSubmissions) {
        throw new Error('This exercise doesnt accept submissions now');
      }
      if (
        await SubmissionModel.findOne({
          studentNick: args.studentNick,
          exercise: exFather._id,
        })
      ) {
        throw new Error(
          'This nick already exists in this exercise, try another one',
        );
      }
      const submission_new = new SubmissionModel({
        id: ObjectId,
        exercise: exFather._id,
        studentNick: args.studentNick,
        content: exFather.content,
        user: exFather.user,
        title: exFather.title,
      });
      const newSub = await SubmissionModel.create(submission_new);
      const token: String = jsonwebtoken.sign(
        {
          exerciseID: exFather._id,
          submissionID: newSub._id,
          studentNick: args.studentNick,
        },
        process.env.JWT_SECRET,
        { expiresIn: '3h' },
      );
      await SubmissionModel.findOneAndUpdate(
        { _id: newSub._id },
        { $set: { submissionToken: token } },
        { new: true },
      );
      return {
        token: token,
        submissionID: newSub._id,
        exerciseID: exFather._id,
      };
    },

    updateSubmission: async (root: any, args: any, context: any) => {
      if (!context.user.exerciseID)
        throw new AuthenticationError('You need to login with exercise code');
      const existSubmission = await SubmissionModel.findOne({
        _id: context.user.submissionID,
        exercise: context.user.exerciseID,
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

    finishSubmission: async (root: any, args: any, context: any) => {
      if (!context.user.exerciseID)
        throw new AuthenticationError(
          'You need to be logged in with exercise code',
        );
      const existSubmission = await SubmissionModel.findOne({
        _id: context.user.submissionID,
        exercise: context.user.exerciseID,
      });
      if (!existSubmission) {
        throw new Error('Error finishing submission, it does not exist');
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
        {
          $set: {
            finished: true,
            content: args.content,
            comment: args.comment,
          },
        },
        { new: true },
      );
    },

    //alumno cancela su propia submission
    cancelSubmission: async (root: any, args: any, context: any) => {
      if (!context.user.exerciseID)
        throw new AuthenticationError(
          'You need to be logged in with exercise code',
        );
      const existSubmission = await SubmissionModel.findOne({
        _id: context.user.submissionID,
        exercise: context.user.exerciseID,
      });
      if (!existSubmission)
        throw new Error(
          'Error canceling submission, it should part of one of your exercises',
        );
      return SubmissionModel.deleteOne({ _id: existSubmission._id });
    },

    //el profesor borra la sumbission de un alumno
    deleteSubmission: async (root: any, args: any, context: any) => {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in as a user');
      else if (!context.user.userID)
        throw new AuthenticationError('You need to be logged in as a user');
      const existSubmission = await SubmissionModel.findOne({
        _id: args.submissionID,
        user: context.user.userID,
      });
      if (!existSubmission)
        throw new Error(
          'Error updating submission, it should part of one of your exercises',
        );
      return SubmissionModel.deleteOne({ _id: existSubmission._id });
    },
  },

  Query: {
    //Student and user querie:
    submission: async (root: any, args: any, context: any) => {
      if (!context.user)
        throw new AuthenticationError(
          'You need to be logged in as a user or as a student',
        );

      if (context.user.submissionID) {
        //Token de alumno
        if (context.user.submissionID != args.id)
          throw new Error('You only can ask for your token submission');
        const sub = await SubmissionModel.findOne({
          _id: context.user.submissionID,
        });
        if (!sub) {
          throw new Error('Submission doesnt exist');
        }
        return sub;
      } else if (context.user.userID) {
        //token de profesor
        const sub = await SubmissionModel.findOne({
          _id: args.id,
          user: context.user.userID,
        });
        if (!sub) {
          throw new Error('Submission doesnt exist');
        }
        return sub;
      }
    },

    //user queries:
    submissionsByExercise: async (root: any, args: any, context: any) => {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in as a user');
      else if (!context.user.userID)
        throw new AuthenticationError('You need to be logged in as a user');
      const exerciseFound = await ExerciseModel.findOne({
        _id: args.exercise,
      });
      if (!exerciseFound) throw new Error('exercise doesnt exist');
      const subs = await SubmissionModel.find({ exercise: exerciseFound._id });
      if (subs.length == 0) {
        throw new Error('No submissions for this exercise');
      }
      return subs;
    },

    submissions: async (root: any, args: any, context: any) => {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in as a user');
      else if (!context.user.userID)
        throw new AuthenticationError('You need to be logged in as a user');
      const subs = await SubmissionModel.find({ user: context.user.userID });
      if (subs.length == 0) {
        throw new Error('No submissions for this exercise');
      }
      return subs;
    },
  },
};

export default submissionResolver;
