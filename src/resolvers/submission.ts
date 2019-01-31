import { ApolloError } from 'apollo-server-koa';
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
        throw new ApolloError(
          'Error creating submission, check your exercise code',
          'INVALID_EXERCISE_CODE',
        );
      //check if the submission is in time
      const timeNow: Date = new Date();
      if (!exFather.acceptSubmissions || timeNow > exFather.expireDate) {
        throw new ApolloError(
          'This exercise does not accept submissions now',
          'NOT_ACCEPT_SUBMISSIONS',
        );
      }

      if (
        await SubmissionModel.findOne({
          studentNick: args.studentNick,
          exercise: exFather._id,
        })
      ) {
        throw new ApolloError(
          'This nick already exists in this exercise, try another one',
          'STUDENT_NICK_EXISTS',
        );
      }
      const submission_new = new SubmissionModel({
        id: ObjectId,
        exercise: exFather._id,
        studentNick: args.studentNick,
        content: exFather.content,
        user: exFather.user,
        document: exFather.document,
        title: exFather.title,
        type: exFather.type,
      });
      const newSub = await SubmissionModel.create(submission_new);
      const token: String = jsonwebtoken.sign(
        {
          exerciseID: exFather._id,
          submissionID: newSub._id,
          studentNick: args.studentNick,
          role: 'EPHEMERAL',
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
        type: exFather.type,
      };
    },

    updateSubmission: async (root: any, args: any, context: any) => {
      const existSubmission = await SubmissionModel.findOne({
        _id: context.user.submissionID,
        exercise: context.user.exerciseID,
      });
      if (!existSubmission)
        throw new ApolloError(
          'Error updating submission, it should part of one of your exercises',
          'SUBMISSION_NOT_FOUND',
        );
      if (existSubmission.finished) {
        throw new ApolloError(
          'You already finished the exercise',
          'SUBMISSION_FINISHED',
        );
      }
      if (existSubmission) {
        return SubmissionModel.findOneAndUpdate(
          { _id: existSubmission._id },
          { $set: args.input },
          { new: true },
        );
      }
    },

    finishSubmission: async (root: any, args: any, context: any) => {
      const existSubmission = await SubmissionModel.findOne({
        _id: context.user.submissionID,
        exercise: context.user.exerciseID,
      });
      if (!existSubmission) {
        throw new ApolloError(
          'Error finishing submission, it does not exist',
          'SUBMISSION_NOT_FOUND',
        );
      }
      const exFather = await ExerciseModel.findOne({
        _id: existSubmission.exercise,
      });
      //check if the exercise accepts submissions
      if (!exFather.acceptSubmissions) {
        throw new ApolloError(
          'This exercise does not accept submissions now',
          'NOT_ACCEPT_SUBMISSIONS',
        );
      }
      //check if the submission is in time
      const timeNow: Date = new Date();
      if (timeNow > exFather.expireDate) {
        throw new ApolloError('Your submission is late', 'SUBMISSION_LATE');
      }
      //check if the submission has been finished
      if (existSubmission.finished) {
        throw new ApolloError(
          'This submission is already finished',
          'SUBMISSION_FINISHED',
        );
      }
      return SubmissionModel.findOneAndUpdate(
        { _id: existSubmission._id },
        {
          $set: {
            finished: true,
            content: args.content,
            comment: args.comment,
            finishedAt: Date.now(),
          },
        },
        { new: true },
      );
    },

    //alumno cancela su propia submission
    cancelSubmission: async (root: any, args: any, context: any) => {
      const existSubmission = await SubmissionModel.findOne({
        _id: context.user.submissionID,
        exercise: context.user.exerciseID,
      });
      if (!existSubmission)
        throw new ApolloError(
          'Error canceling submission, it should part of one of your exercises',
          'SUBMISSION_NOT_FOUND',
        );
      return SubmissionModel.deleteOne({ _id: existSubmission._id });
    },

    //el profesor borra la sumbission de un alumno
    deleteSubmission: async (root: any, args: any, context: any) => {
      const existSubmission = await SubmissionModel.findOne({
        _id: args.submissionID,
        user: context.user.userID,
      });
      if (!existSubmission)
        throw new ApolloError(
          'Error updating submission, it should part of one of your exercises',
          'SUBMISSION_NOT_FOUND',
        );
      return SubmissionModel.deleteOne({ _id: existSubmission._id });
    },
  },

  Query: {
    //devuelve todas las entregas que los alumnos han realizado, necesita usuario logado
    submissions: async (root: any, args: any, context: any) => {
      return SubmissionModel.find({ user: context.user.userID });
    },

    //Student and user querie:
    //devuelve la información de la submission que se le pasa en el id con el tocken del alumno o de usuario
    submission: async (root: any, args: any, context: any) => {
      if (context.user.submissionID) {
        //Token de alumno
        if (context.user.submissionID != args.id)
          throw new ApolloError(
            'You only can ask for your token submission',
            'NOT_YOUR_SUBMISSION',
          );
        const existSubmission = await SubmissionModel.findOne({
          _id: context.user.submissionID,
        });
        if (!existSubmission) {
          throw new ApolloError(
            'Submission does not exist',
            'SUBMISSION_NOT_FOUND',
          );
        }
        return existSubmission;
      } else if (context.user.userID) {
        //token de profesor
        const existSubmission = await SubmissionModel.findOne({
          _id: args.id,
          user: context.user.userID,
        });
        if (!existSubmission) {
          throw new ApolloError(
            'Submission does not exist',
            'SUBMISSION_NOT_FOUND',
          );
        }
        return existSubmission;
      }
    },

    //user queries:
    submissionsByExercise: async (root: any, args: any, context: any) => {
      const exFather = await ExerciseModel.findOne({
        _id: args.exercise,
      });
      if (!exFather)
        throw new ApolloError('exercise does not exist', 'EXERCISE_NOT_FOUND');
      const existSubmissions = await SubmissionModel.find({
        exercise: exFather._id,
      });
      return existSubmissions;
    },
  },
};

export default submissionResolver;
