import { ApolloError, PubSub, withFilter } from 'apollo-server-koa';
import { ObjectId } from 'bson';
import { ExerciseModel } from '../models/exercise';
import { LogModel } from '../models/logs';
import { SubmissionModel } from '../models/submission';

export const pubsub = new PubSub();
const jsonwebtoken = require('jsonwebtoken');

const SUBMISSION_UPDATED: string = 'SUBMISSION_UPDATED';

const submissionResolver = {
  Subscription: {
    submissionUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([SUBMISSION_UPDATED]),
        (payload, variables) => {
          return payload.submissionUpdated.exercise == variables.exercise;
        },
      ),
    },
  },
  Mutation: {
    /**
     * Create submission: register a new student than joins the exercise.
     * It stores the new student information in the database and
     * returns a login token with the exercise and submission ID.
     * args: exercise code and student nickname.
     */
    createSubmission: async (root: any, args: any, context: any) => {
      const exFather = await ExerciseModel.findOne({
        code: args.exerciseCode,
        acceptSubmissions: true,
      });
      if (!exFather) {
        throw new ApolloError(
          'Error creating submission, check your exercise code',
          'INVALID_EXERCISE_CODE',
        );
      }
      // check if the submission is in time
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
      const submissionNew = new SubmissionModel({
        id: ObjectId,
        exercise: exFather._id,
        studentNick: args.studentNick,
        content: exFather.content,
        user: exFather.user,
        document: exFather.document,
        title: exFather.title,
        type: exFather.type,
      });
      const newSub = await SubmissionModel.create(submissionNew);
      const token: string = jsonwebtoken.sign(
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
      await LogModel.create({
        user: exFather.user,
        object: submissionNew._id,
        action: 'SUB_create',
        docType: submissionNew.type,
      });
      pubsub.publish(SUBMISSION_UPDATED, { submissionUpdated: newSub });
      return {
        token,
        submissionID: newSub._id,
        exerciseID: exFather._id,
        type: exFather.type,
      };
    },

    /**
     * Update submission: update existing submission.
     * It updates the submission with the new information provided.
     * args: submission ID, new submission information.
     */
    updateSubmission: async (root: any, args: any, context: any) => {
      const existSubmission = await SubmissionModel.findOne({
        _id: context.user.submissionID,
        exercise: context.user.exerciseID,
      });
      if (!existSubmission) {
        throw new ApolloError(
          'Error updating submission, it should part of one of your exercises',
          'SUBMISSION_NOT_FOUND',
        );
      }
      if (existSubmission.finished) {
        throw new ApolloError(
          'You already finished the exercise',
          'SUBMISSION_FINISHED',
        );
      }
      if (existSubmission) {
        await LogModel.create({
          user: existSubmission.user,
          object: existSubmission._id,
          action: 'SUB_update',
          docType: existSubmission.type,
        });
        const updatedSubmission = await SubmissionModel.findOneAndUpdate(
          { _id: existSubmission._id },
          { $set: args.input },
          { new: true },
        );
        pubsub.publish(SUBMISSION_UPDATED, {
          submissionUpdated: updatedSubmission,
        });
        return updatedSubmission;
      }
    },

    /**
     * Finish submission: set the finished property of the submission to true
     * and stores the content and a comment in the database.
     * It checks if the exercise accept new submissions and if the submission is in time.
     * It is necessary to be logged in as student.
     * args: content of the submission and comment.
     */
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
      // check if the exercise accepts submissions
      if (!exFather.acceptSubmissions) {
        throw new ApolloError(
          'This exercise does not accept submissions now',
          'NOT_ACCEPT_SUBMISSIONS',
        );
      }
      // check if the submission is in time
      const timeNow: Date = new Date();
      if (timeNow > exFather.expireDate) {
        throw new ApolloError('Your submission is late', 'SUBMISSION_LATE');
      }
      // check if the submission has been finished
      if (existSubmission.finished) {
        throw new ApolloError(
          'This submission is already finished',
          'SUBMISSION_FINISHED',
        );
      }
      await LogModel.create({
        user: existSubmission.user,
        object: existSubmission._id,
        action: 'SUB_finish',
        docType: existSubmission.type,
      });
      const updatedSubmission = await SubmissionModel.findOneAndUpdate(
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
      pubsub.publish(SUBMISSION_UPDATED, {
        submissionUpdated: updatedSubmission,
      });
      return updatedSubmission;
    },

    /**
     * Cancel submission: cancel the submission of the student logged.
     * It deletes the submission passed in the context as student token.
     * args: nothing
     */
    // alumno cancela su propia submission
    cancelSubmission: async (root: any, args: any, context: any) => {
      const existSubmission = await SubmissionModel.findOne({
        _id: context.user.submissionID,
        exercise: context.user.exerciseID,
      });
      if (!existSubmission) {
        throw new ApolloError(
          'Error canceling submission, it should part of one of your exercises',
          'SUBMISSION_NOT_FOUND',
        );
      }
      await LogModel.create({
        user: existSubmission.user,
        object: existSubmission._id,
        action: 'SUB_cancel',
        docType: existSubmission.type,
      });
      return SubmissionModel.deleteOne({ _id: existSubmission._id });
    },

    /**
     * Delete submission: user logged deletes one submission of the students registered.
     * It deletes the submission passed in the arguments if it belongs to the user logged.
     * args: submission ID
     */

    // el profesor borra la sumbission de un alumno
    deleteSubmission: async (root: any, args: any, context: any) => {
      const existSubmission = await SubmissionModel.findOne({
        _id: args.submissionID,
        user: context.user.userID,
      });
      if (!existSubmission) {
        throw new ApolloError(
          'Error updating submission, it should part of one of your exercises',
          'SUBMISSION_NOT_FOUND',
        );
      }
      await LogModel.create({
        user: existSubmission.user,
        object: existSubmission._id,
        action: 'SUB_delete',
        docType: existSubmission.type,
      });
      return SubmissionModel.deleteOne({ _id: existSubmission._id });
    },
  },

  Query: {
    /**
     * Submissions: returns all the submissions of the user logged.
     * args: nothing.
     */
    // devuelve todas las entregas que los alumnos han realizado, necesita usuario logado
    submissions: async (root: any, args: any, context: any) => {
      await LogModel.create({
        user: context.user.userID,
        action: 'SUB_submissions',
      });
      return SubmissionModel.find({ user: context.user.userID });
    },

    /**
     * Submission: returns the information of the submission ID provided in the arguments.
     * It can be asked with the user logged token or the student token.
     * args: submission ID.
     */
    // Student and user querie:
    // devuelve la información de la submission que se le pasa en el id con el tocken del alumno o de usuario
    submission: async (root: any, args: any, context: any) => {
      if (context.user.submissionID) {
        // Token de alumno
        if (context.user.submissionID !== args.id) {
          throw new ApolloError(
            'You only can ask for your token submission',
            'NOT_YOUR_SUBMISSION',
          );
        }
        const existSubmission = await SubmissionModel.findOne({
          _id: context.user.submissionID,
        });
        if (!existSubmission) {
          throw new ApolloError(
            'Submission does not exist',
            'SUBMISSION_NOT_FOUND',
          );
        }
        await LogModel.create({
          user: existSubmission.user,
          action: 'SUB_submission',
          docType: existSubmission.type,
        });
        return existSubmission;
      } else if (context.user.userID) {
        // token de profesor
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
        await LogModel.create({
          user: context.user.userID,
          action: 'SUB_submission',
          docType: existSubmission.type,
        });
        return existSubmission;
      }
    },

    /**
     * Submissions by exercise: returns all the submissions
     *  that depends on the exercise father ID passed in the arguments.
     * args: exercise ID.
     */
    // user queries:
    submissionsByExercise: async (root: any, args: any, context: any) => {
      const exFather = await ExerciseModel.findOne({
        _id: args.exercise,
      });
      if (!exFather) {
        throw new ApolloError('exercise does not exist', 'EXERCISE_NOT_FOUND');
      }
      const existSubmissions = await SubmissionModel.find({
        exercise: exFather._id,
      });
      await LogModel.create({
        user: context.user.userID,
        action: 'SUB_submissionsExercise',
      });
      return existSubmissions;
    },
  },
};

export default submissionResolver;
