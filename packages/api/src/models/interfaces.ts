import { ObjectID } from "bson";

export interface ICommonProps {
  user?: string;
  name?: string;
  type?: string;
  description?: string;
  content?: string;
  cache?: string;
  resourcesID?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
// User in token user interface
export interface IUserInToken {
  userId: string;
  permissions: string;
  submissionID?: string;
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
