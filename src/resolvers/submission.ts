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
      //check if the submission is in time
      const timeNow: Date = new Date();
      if (!exFather.acceptSubmissions || timeNow > exFather.expireDate) {
        throw new Error('This exercise does not accept submissions now');
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
        return new Error('Exercise does not exist');
      }
    },

    finishSubmission: async (root: any, args: any, context: any) => {
      const existSubmission = await SubmissionModel.findOne({
        _id: context.user.submissionID,
        exercise: context.user.exerciseID,
      });
      if (!existSubmission) {
        throw new Error('Error finishing submission, it does not exist');
      }
      const exFather = await ExerciseModel.findOne({
        _id: existSubmission.exercise,
      });
      //check if the exercise accepts submissions
      if (!exFather.acceptSubmissions) {
        throw new Error('This exercise does not accept submissions now');
      }
      //check if the submission is in time
      const timeNow: Date = new Date();
      if (timeNow > exFather.expireDate) {
        throw new Error('Your submission is late');
      }
      //check if the submission has been finished
      if (existSubmission.finished) {
        throw new Error('This submission is already finished');
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
        throw new Error(
          'Error canceling submission, it should part of one of your exercises',
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
        throw new Error(
          'Error updating submission, it should part of one of your exercises',
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
          throw new Error('You only can ask for your token submission');
        const existSubmission = await SubmissionModel.findOne({
          _id: context.user.submissionID,
        });
        if (!existSubmission) {
          throw new Error('Submission does not exist');
        }
        return existSubmission;
      } else if (context.user.userID) {
        //token de profesor
        const existSubmission = await SubmissionModel.findOne({
          _id: args.id,
          user: context.user.userID,
        });
        if (!existSubmission) {
          throw new Error('Submission does not exist');
        }
        return existSubmission;
      }
    },

    //user queries:
    submissionsByExercise: async (root: any, args: any, context: any) => {
      const exFather = await ExerciseModel.findOne({
        _id: args.exercise,
      });
      if (!exFather) throw new Error('exercise does not exist');
      const existSubmissions = await SubmissionModel.find({
        exercise: exFather._id,
      });
      if (existSubmissions.length == 0) {
        throw new Error('No submissions for this exercise');
      }
      return existSubmissions;
    },
  },
};

export default submissionResolver;
