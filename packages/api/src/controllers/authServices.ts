import AuthService from "../../auth-service/authService";
import { UserModel, IUser } from "../models/user";
import { SESSION, USER_PERMISSIONS } from "../config";
import { USER_SESSION_EXPIRES } from "../resolvers/user";
import { SubmissionModel } from "../models/submission";
import { SUBMISSION_SESSION_EXPIRES } from "../resolvers/submission";

const initAuthService = (redisClient, pubsub) => {
  const userAuthService = new AuthService({
    redisClient: redisClient,
    sessionDuration: SESSION.DURATION_MINUTES,
    sessionWarning: SESSION.SHOW_WARNING_SECONDS,
    singleSession: true,
    getUserData: async credentials => {
      if (credentials.user) {
        let user;
        try {
          user = await UserModel.findOne({ email: credentials.user });
        } catch (e) {
          console.error(e);
        }
        return user
          ? {
              active: user.active,
              email: user.email,
              finishedSignUp: user.finishedSignUp || false,
              id: user._id,
              password: user.password,
              permissions: user.permissions
            }
          : null;
      }
      return null;
    },
    onSessionExpires: async (
      key: string,
      secondsRemaining: number,
      expiredSession: boolean,
      reason: string,
      userId: string
    ) => {
      await pubsub.publish(USER_SESSION_EXPIRES, {
        userSessionExpires: {
          key: userId,
          secondsRemaining,
          expiredSession,
          showSessionWarningSecs: SESSION.SHOW_WARNING_SECONDS,
          reason: reason
        }
      });
    }
  });

  const studentAuthService = new AuthService({
    redisClient: redisClient,
    sessionDuration: SESSION.DURATION_MINUTES,
    sessionWarning: SESSION.SHOW_WARNING_SECONDS,
    singleSession: true,
    getUserData: async credentials => {
      if (credentials.studentNick && credentials.exerciseId) {
        const submission = await SubmissionModel.findOne({
          studentNick: credentials.studentNick.toLowerCase(),
          exercise: credentials.exerciseId
        });
        return submission
          ? {
              active: submission.active,
              email: submission.studentNick!,
              id: submission._id,
              password: submission.password,
              permissions: USER_PERMISSIONS.student
            }
          : null;
      }
      return null;
    },
    onSessionExpires: async (
      key: string,
      secondsRemaining: number,
      expiredSession: boolean,
      reason: string,
      userId: string
    ) => {
      pubsub.publish(SUBMISSION_SESSION_EXPIRES, {
        submissionSessionExpires: {
          key: userId,
          secondsRemaining,
          expiredSession,
          showSessionWarningSecs: SESSION.SHOW_WARNING_SECONDS,
          reason: reason
        }
      });
    }
  });
  return { studentAuthService, userAuthService };
};

export default initAuthService;
