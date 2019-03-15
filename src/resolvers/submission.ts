import { ApolloError, PubSub, withFilter } from 'apollo-server-koa';
import { ExerciseModel } from '../models/exercise';
import { SubmissionModel } from '../models/submission';
import { pubsub } from '../server';

const jsonwebtoken = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const saltRounds = 7;

const SUBMISSION_UPDATED: string = 'SUBMISSION_UPDATED';

const submissionResolver = {
  Subscription: {
    submissionUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([SUBMISSION_UPDATED]),
        (payload, variables, context) => {
          return payload.submissionUpdated.exercise == variables.exercise;
        },
      ),
    },
  },
  Mutation: {
    /**
     * Login submission: register a new student than joins the exercise.
     * It stores the new student information in the database and
     * returns a login token with the exercise and submission ID.
     * If a submission with the nick and password provided exists, the mutation
     * returns it. If not, it create a new empty submission.     *
     * args: exercise code and student nickname and password.
     */
    loginSubmission: async (root: any, args: any, context: any) => {
      if (!args.studentNick) {
        throw new ApolloError(
          'Error creating submission, you must introduce a nickname',
          'NOT_NICKNAME_PROVIDED',
        );
      }
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
      // check if there is a submission with this nickname and password. If true, return it.
      const existSubmission = await SubmissionModel.findOne({
        studentNick: args.studentNick.toLowerCase(),
        exercise: exFather._id,
      });
      if (existSubmission) {
        // si existe la submission, compruebo la contraseña y la devuelvo
        const valid: boolean = await bcrypt.compare(
          args.password,
          existSubmission.password,
        );
        if (valid) {
          const token: string = jsonwebtoken.sign(
            {
              exerciseID: exFather._id,
              submissionID: existSubmission._id,
              role: 'EPHEMERAL',
            },
            process.env.JWT_SECRET,
            { expiresIn: '3h' },
          );
          await SubmissionModel.findOneAndUpdate(
            { _id: existSubmission._id },
            { $set: { submissionToken: token } },
            { new: true },
          );
          pubsub.publish(SUBMISSION_UPDATED, {
            submissionUpdated: existSubmission,
          });
          return {
            token: token,
            exerciseID: exFather._id,
            type: existSubmission.type,
          };
        } else {
          throw new ApolloError(
            'comparing passwords valid=false',
            'PASSWORD_ERROR',
          );
        }
      } else {
        // la submission no existe, se crea una nueva
        const hash: string = await bcrypt.hash(args.password, saltRounds);
        const submissionNew = new SubmissionModel({
          exercise: exFather._id,
          studentNick: args.studentNick.toLowerCase(),
          password: hash,
          content: exFather.content,
          cache: exFather.cache,
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
        pubsub.publish(SUBMISSION_UPDATED, { submissionUpdated: newSub });
        return {
          token: token,
          exerciseID: exFather._id,
          type: newSub.type,
        };
      }
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
      if (existSubmission) {
        // importante! no se puede actualizar el nickname
        if (args.input.studentNick) {
          throw new ApolloError(
            'Error updating submission, you can not change your nickname',
            'CANT_UPDATE_NICKNAME',
          );
        }
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
      const updatedSubmission = await SubmissionModel.findOneAndUpdate(
        { _id: existSubmission._id },
        {
          $set: {
            finished: true,
            content: args.content,
            cache: args.cache,
            studentComment: args.studentComment,
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
          'Error deleting submission, not found',
          'SUBMISSION_NOT_FOUND',
        );
      }
      return SubmissionModel.deleteOne({ _id: existSubmission._id });
    },

    /**
     * Grade submission: user logged grades a student submission.
     * It updates the submission with the new information provided: grade and teacher comment.
     * args: submissionID, grade and teacherComment
     */
    gradeSubmission: async (root: any, args: any, context: any) => {
      const existSubmission = await SubmissionModel.findOne({
        _id: args.submissionID,
        user: context.user.userID,
      });
      if (!existSubmission) {
        throw new ApolloError(
          'Error grading submission, not found',
          'SUBMISSION_NOT_FOUND',
        );
      }
      // La sumission tiene que estar acabada
      if (!existSubmission.finished) {
        throw new ApolloError(
          'Error grading submission, submission not finished by student',
          'SUBMISSION_NOT_FINISHED',
        );
      }

      const updatedSubmission = await SubmissionModel.findOneAndUpdate(
        { _id: existSubmission._id },
        {
          $set: {
            grade: args.grade,
            teacherComment: args.teacherComment,
            gradedAt: Date.now(),
          },
        },
        { new: true },
      );
      return updatedSubmission;
    },
  },

  Query: {
    /**
     * Submissions: returns all the submissions of the user logged.
     * args: nothing.
     */
    // devuelve todas las entregas que los alumnos han realizado, necesita usuario logado
    submissions: async (root: any, args: any, context: any) => {
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
      return existSubmissions;
    },
  },
};

export default submissionResolver;
