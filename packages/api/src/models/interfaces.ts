import { ObjectID } from "bson";

// User in token user interface
export interface IUserInToken {
  email: string;
  userID: string;
  submissionID: string;
  role: string;
  exerciseID?: string;
}

// Email data needed in mjml
export interface IEmailData {
  url: string;
}

export interface IResetPasswordToken {
  resetPassUserID: ObjectID;
}

export interface ISignUpToken {
  signUpUserID: ObjectID;
}

export interface IDataInRedis {
  expiresAt: Date;
  authToken?: string;
  subToken?: string;
}
