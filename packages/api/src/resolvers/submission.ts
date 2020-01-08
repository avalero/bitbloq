import { ApolloError, withFilter } from "apollo-server-koa";
import { ExerciseModel, IExercise } from "../models/exercise";
import { ISubmission, SubmissionModel } from "../models/submission";
import { pubsub, redisClient } from "../server";

import { sign as jwtSign } from "jsonwebtoken";
import { hash as bcryptHash, compare as bcryptCompare } from "bcrypt";
import {
  ISubscriptionSubmissionUpdatedArgs,
  IMutationStartSubmissionArgs,
  IMutationLoginSubmissionArgs,
  IMutationUpdateSubmissionArgs,
  IMutationSetActiveSubmissionArgs,
  IMutationFinishSubmissionArgs,
  IMutationDeleteSubmissionArgs,
  IMutationGradeSubmissionArgs,
  IMutationUpdatePasswordSubmissionArgs,
  IQuerySubmissionArgs,
  IQuerySubmissionsByExerciseArgs,
  ISessionExpires
} from "../api-types";
import { IUserInToken } from "../models/interfaces";
import {
  storeTokenInRedis,
  updateExpireDateInRedis,
  contextController
} from "../controllers/context";
import { CONTENT_VERSION } from "../config";

const saltRounds = 7;

const SUBMISSION_UPDATED: string = "SUBMISSION_UPDATED";
export const SUBMISSION_ACTIVE: string = "SUBMISSION_ACTIVE";
export const SUBMISSION_SESSION_EXPIRES: string = "SUBMISSION_SESSION_EXPIRES";

const submissionResolver = {
  Subscription: {
    submissionUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([SUBMISSION_UPDATED]),
        (
          payload: { submissionUpdated: ISubmission },
          variables: ISubscriptionSubmissionUpdatedArgs,
          context: { user: IUserInToken }
        ) => {
          if (
            String(context.user.userID) ===
              String(payload.submissionUpdated.user) ||
            String(context.user.role).indexOf("stu") >= 0
          ) {
            return (
              String(payload.submissionUpdated.exercise) ===
              String(variables.exercise)
            );
          } else {
            return false;
          }
        }
      )
    },
    submissionActive: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([SUBMISSION_ACTIVE]),
        (payload, variables, context) => {
          return (
            String(payload.submissionActive.id) ===
            String(context.user.submissionID)
          );
        }
      )
    },
    submissionSessionExpires: {
      subscribe: withFilter(
        // Filtra para devolver solo los documentos del usuario
        () => pubsub.asyncIterator([SUBMISSION_SESSION_EXPIRES]),
        (
          payload: { submissionSessionExpires: ISessionExpires },
          variables,
          context: { user: IUserInToken }
        ) => {
          return (
            String(context.user.submissionID) ===
            String(payload.submissionSessionExpires.key)
          );
        }
      )
    }
  },
  Mutation: {
    /**
     * Start submission: register a new student than joins the exercise.
     * It stores the new student information in the database and
     * returns a login token with the exercise and submission ID.
     * args: exercise code and student nickname and password.
     */
    startSubmission: async (
      _,
      args: IMutationStartSubmissionArgs,
      context: { user: IUserInToken }
    ) => {
      if (!args.studentNick) {
        throw new ApolloError(
          "Error creating submission, you must introduce a nickname",
          "NOT_NICKNAME_PROVIDED"
        );
      }
      const exFather: IExercise | null = await ExerciseModel.findOne({
        code: args.exerciseCode
      });
      if (!exFather) {
        throw new ApolloError(
          "Error creating submission, check your exercise code",
          "INVALID_EXERCISE_CODE"
        );
      }
      // check if the submission is in time
      const timeNow: Date = new Date();
      if (!exFather.acceptSubmissions || timeNow > exFather.expireDate!) {
        throw new ApolloError(
          "This exercise does not accept submissions now",
          "NOT_ACCEPT_SUBMISSIONS"
        );
      }
      // check if there is a submission with this nickname and password. If true, return error.
      const existSubmission: ISubmission | null = await SubmissionModel.findOne(
        {
          studentNick: args.studentNick.toLowerCase(),
          exercise: exFather._id
        }
      );
      if (existSubmission) {
        throw new ApolloError(
          "There is already a submission for that studentNick",
          "SUBMISSION_EXISTS"
        );
      }

      const hash: string = await bcryptHash(args.password, saltRounds);
      const submissionNew: ISubmission = new SubmissionModel({
        exercise: exFather._id,
        studentNick: args.studentNick.toLowerCase(),
        password: hash,
        content: exFather.content,
        cache: exFather.cache,
        user: exFather.user,
        document: exFather.document,
        title: exFather.title,
        type: exFather.type,
        active: true,
        contentVersion: exFather.contentVersion || CONTENT_VERSION
      });
      const newSub: ISubmission = await SubmissionModel.create(submissionNew);
      const token: string = jwtSign(
        {
          exerciseID: exFather._id,
          submissionID: newSub.id,
          role: "stu-"
        },
        process.env.JWT_SECRET
        // { expiresIn: "3h" }
      );
      await SubmissionModel.findOneAndUpdate(
        { _id: newSub.id },
        { $set: { submissionToken: token } },
        { new: true }
      );
      if (process.env.USE_REDIS === "true") {
        await storeTokenInRedis(newSub.id, token, true);
      }
      pubsub.publish(SUBMISSION_UPDATED, { submissionUpdated: newSub });
      return {
        token,
        exerciseID: exFather._id,
        type: newSub.type
      };
    },

    /**
     * Login submission: If a submission with the nick and password provided exists,
     * the mutation returns it. If not, returns an error.
     * args: exercise code and student nickname and password.
     */
    loginSubmission: async (_, args: IMutationLoginSubmissionArgs) => {
      if (!args.studentNick) {
        throw new ApolloError(
          "Error creating submission, you must introduce a nickname",
          "NOT_NICKNAME_PROVIDED"
        );
      }
      const exFather: IExercise | null = await ExerciseModel.findOne({
        code: args.exerciseCode
      });
      if (!exFather) {
        throw new ApolloError(
          "Error creating submission, check your exercise code",
          "INVALID_EXERCISE_CODE"
        );
      }
      // check if the submission is in time
      const timeNow: Date = new Date();
      if (!exFather.acceptSubmissions || timeNow > exFather.expireDate!) {
        throw new ApolloError(
          "This exercise does not accept submissions now",
          "NOT_ACCEPT_SUBMISSIONS"
        );
      }
      // check if there is a submission with this nickname and password. If true, return it.
      const existSubmission: ISubmission | null = await SubmissionModel.findOne(
        {
          studentNick: args.studentNick.toLowerCase(),
          exercise: exFather._id
        }
      );
      if (!existSubmission) {
        throw new ApolloError(
          "Can't found submission for that studentNick",
          "SUBMISSION_NOT_FOUND"
        );
      }

      // si existe la submission, compruebo la contraseña y la devuelvo
      const valid: boolean = await bcryptCompare(
        args.password,
        existSubmission.password
      );
      if (valid) {
        const token: string = jwtSign(
          {
            exerciseID: exFather._id,
            submissionID: existSubmission.id,
            role: "stu-"
          },
          process.env.JWT_SECRET
          // { expiresIn: "3h" }
        );
        await SubmissionModel.findOneAndUpdate(
          { _id: existSubmission.id },
          { $set: { submissionToken: token, active: true } },
          { new: true }
        );
        pubsub.publish(SUBMISSION_UPDATED, {
          submissionUpdated: existSubmission
        });
        if (process.env.USE_REDIS === "true") {
          await storeTokenInRedis(existSubmission.id, token, true);
        }
        return {
          token,
          exerciseID: exFather._id,
          type: existSubmission.type
        };
      } else {
        throw new ApolloError(
          "comparing passwords valid=false",
          "PASSWORD_ERROR"
        );
      }
    },

    /**
     * Update submission: update existing submission.
     * It updates the submission with the new information provided.
     * args: submission ID, new submission information.
     */
    updateSubmission: async (
      _,
      args: IMutationUpdateSubmissionArgs,
      context: { user: IUserInToken }
    ) => {
      const existSubmission: ISubmission | null = await SubmissionModel.findOne(
        {
          _id: context.user.submissionID,
          exercise: context.user.exerciseID
        }
      );
      if (!existSubmission) {
        throw new ApolloError(
          "Error updating submission, it should part of one of your exercises",
          "SUBMISSION_NOT_FOUND"
        );
      }
      if (existSubmission) {
        // importante! no se puede actualizar el nickname
        if (args.input!.studentNick) {
          throw new ApolloError(
            "Error updating submission, you can not change your nickname",
            "CANT_UPDATE_NICKNAME"
          );
        }
        const updatedSubmission: ISubmission | null = await SubmissionModel.findOneAndUpdate(
          { _id: existSubmission.id },
          { $set: args.input },
          { new: true }
        );
        pubsub.publish(SUBMISSION_UPDATED, {
          submissionUpdated: updatedSubmission
        });
        if (process.env.USE_REDIS === "true") {
          await updateExpireDateInRedis(existSubmission.id, true);
        }
        return updatedSubmission;
      }
      return;
    },

    /**
     * Set active submissions: update existing exercise.
     * It updates the exercise with active/disabled submissions.
     * args: exercise ID, studentNick and active.
     */
    setActiveSubmission: async (
      _,
      args: IMutationSetActiveSubmissionArgs,
      context: { user: IUserInToken }
    ) => {
      const existSubmission: ISubmission | null = await SubmissionModel.findOne(
        {
          _id: args.submissionID,
          user: context.user.userID
        }
      );
      if (existSubmission) {
        const updatedSubmission: ISubmission | null = await SubmissionModel.findOneAndUpdate(
          { _id: existSubmission.id },
          {
            $set: {
              active: args.active
            }
          },
          { new: true }
        );
        pubsub.publish(SUBMISSION_ACTIVE, {
          submissionActive: updatedSubmission
        });
        return updatedSubmission;
      } else {
        return new ApolloError("Exercise does not exist", "EXERCISE_NOT_FOUND");
      }
    },

    /**
     * Finish submission: set the finished property of the submission to true
     * and stores the content and a comment in the database.
     * It checks if the exercise accept new submissions and if the submission is in time.
     * It is necessary to be logged in as student.
     * args: content of the submission and comment.
     */
    finishSubmission: async (
      _,
      args: IMutationFinishSubmissionArgs,
      context: { user: IUserInToken }
    ) => {
      const existSubmission: ISubmission | null = await SubmissionModel.findOne(
        {
          _id: context.user.submissionID,
          exercise: context.user.exerciseID
        }
      );
      if (!existSubmission) {
        throw new ApolloError(
          "Error finishing submission, it does not exist",
          "SUBMISSION_NOT_FOUND"
        );
      }
      const exFather: IExercise | null = await ExerciseModel.findOne({
        _id: existSubmission.exercise
      });
      if (!exFather) {
        throw new ApolloError(
          "This exercise does not hava a father",
          "EXERCISE_NOT_FOUND"
        );
      }
      // check if the exercise accepts submissions
      if (!exFather.acceptSubmissions) {
        throw new ApolloError(
          "This exercise does not accept submissions now",
          "NOT_ACCEPT_SUBMISSIONS"
        );
      }
      // check if the submission is in time
      const timeNow: Date = new Date();
      if (timeNow > exFather.expireDate!) {
        throw new ApolloError("Your submission is late", "SUBMISSION_LATE");
      }
      const updatedSubmission = await SubmissionModel.findOneAndUpdate(
        { _id: existSubmission.id },
        {
          $set: {
            finished: true,
            content: args.content,
            cache: args.cache,
            studentComment: args.studentComment,
            finishedAt: Date.now()
          }
        },
        { new: true }
      );
      pubsub.publish(SUBMISSION_UPDATED, {
        submissionUpdated: updatedSubmission
      });
      return updatedSubmission;
    },

    /**
     * Cancel submission: cancel the submission of the student logged.
     * It deletes the submission passed in the context as student token.
     * args: nothing
     */
    // alumno cancela su propia submission
    cancelSubmission: async (_, __, context: { user: IUserInToken }) => {
      const existSubmission: ISubmission | null = await SubmissionModel.findOne(
        {
          _id: context.user.submissionID,
          exercise: context.user.exerciseID
        }
      );
      if (!existSubmission) {
        throw new ApolloError(
          "Error canceling submission, it should part of one of your exercises",
          "SUBMISSION_NOT_FOUND"
        );
      }
      return SubmissionModel.deleteOne({ _id: existSubmission.id });
    },

    /**
     * Delete submission: user logged deletes one submission of the students registered.
     * It deletes the submission passed in the arguments if it belongs to the user logged.
     * args: submission ID
     */
    // el profesor borra la sumbission de un alumno
    deleteSubmission: async (
      _,
      args: IMutationDeleteSubmissionArgs,
      context: { user: IUserInToken }
    ) => {
      const existSubmission: ISubmission | null = await SubmissionModel.findOneAndUpdate(
        {
          _id: args.submissionID,
          user: context.user.userID
        },
        {
          $set: { active: false }
        },
        { new: true }
      );
      if (!existSubmission) {
        throw new ApolloError(
          "Error deleting submission, not found",
          "SUBMISSION_NOT_FOUND"
        );
      }
      pubsub.publish(SUBMISSION_ACTIVE, {
        submissionActive: existSubmission
      });
      return SubmissionModel.deleteOne({ _id: existSubmission.id });
    },

    /**
     * Grade submission: user logged grades a student submission.
     * It updates the submission with the new information provided: grade and teacher comment.
     * args: submissionID, grade and teacherComment
     */
    gradeSubmission: async (
      _,
      args: IMutationGradeSubmissionArgs,
      context: { user: IUserInToken }
    ) => {
      const existSubmission: ISubmission | null = await SubmissionModel.findOne(
        {
          _id: args.submissionID,
          user: context.user.userID
        }
      );
      if (!existSubmission) {
        throw new ApolloError(
          "Error grading submission, not found",
          "SUBMISSION_NOT_FOUND"
        );
      }
      // La sumission tiene que estar acabada
      if (!existSubmission.finished) {
        throw new ApolloError(
          "Error grading submission, submission not finished by student",
          "SUBMISSION_NOT_FINISHED"
        );
      }

      const updatedSubmission: ISubmission | null = await SubmissionModel.findOneAndUpdate(
        { _id: existSubmission.id },
        {
          $set: {
            grade: args.grade,
            teacherComment: args.teacherComment,
            gradedAt: Date.now()
          }
        },
        { new: true }
      );
      pubsub.publish(SUBMISSION_UPDATED, {
        submissionUpdated: updatedSubmission
      });
      return updatedSubmission;
    },

    /**
     * Update password submission: teacher logged change the password of a submission.
     * It updates the submission with the new information provided: password.
     * args: submissionID and password
     */
    updatePasswordSubmission: async (
      _,
      args: IMutationUpdatePasswordSubmissionArgs,
      context: { user: IUserInToken }
    ) => {
      const existSubmission: ISubmission | null = await SubmissionModel.findOne(
        {
          _id: args.submissionID,
          user: context.user.userID
        }
      );
      if (!existSubmission) {
        throw new ApolloError(
          "Error grading submission, not found",
          "SUBMISSION_NOT_FOUND"
        );
      }
      const hash: string = await bcryptHash(args.password, saltRounds);
      const updatedSubmission: ISubmission | null = await SubmissionModel.findOneAndUpdate(
        { _id: existSubmission.id },
        {
          $set: {
            password: hash
          }
        },
        { new: true }
      );
      return updatedSubmission;
    }
  },

  Query: {
    /**
     * Submissions: returns all the submissions of the user logged.
     * args: nothing.
     */
    // devuelve todas las entregas que los alumnos han realizado, necesita usuario logado
    submissions: async (_, __, context: { user: IUserInToken }) => {
      return SubmissionModel.find({ user: context.user.userID });
    },

    /**
     * Submission: returns the information of the submission ID provided in the arguments.
     * It can be asked with the user logged token or the student token.
     * args: submission ID.
     */
    // Student and user querie:
    // devuelve la información de la submission que se le pasa en el id con el tocken del alumno o de usuario
    submission: async (
      _,
      args: IQuerySubmissionArgs,
      context: { user: IUserInToken }
    ) => {
      if (context.user.submissionID) {
        // Token de alumno
        const existSubmission: ISubmission | null = await SubmissionModel.findOne(
          {
            _id: context.user.submissionID
          }
        );
        if (!existSubmission) {
          throw new ApolloError(
            "Submission does not exist",
            "SUBMISSION_NOT_FOUND"
          );
        }
        return existSubmission;
      } else if (context.user.userID) {
        // token de profesor
        const existSubmission: ISubmission | null = await SubmissionModel.findOne(
          {
            _id: args.id,
            user: context.user.userID
          }
        );
        if (!existSubmission) {
          throw new ApolloError(
            "Submission does not exist",
            "SUBMISSION_NOT_FOUND"
          );
        }
        return existSubmission;
      }
      return;
    },

    /**
     * Submissions by exercise: returns all the submissions
     *  that depends on the exercise father ID passed in the arguments.
     * args: exercise ID.
     */
    // user queries:
    submissionsByExercise: async (_, args: IQuerySubmissionsByExerciseArgs) => {
      const exFather: IExercise | null = await ExerciseModel.findOne({
        _id: args.exercise
      });
      if (!exFather) {
        throw new ApolloError("exercise does not exist", "EXERCISE_NOT_FOUND");
      }
      return SubmissionModel.find({
        exercise: exFather._id
      });
    }
  }
};

export default submissionResolver;
