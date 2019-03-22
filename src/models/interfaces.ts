import { ObjectID } from 'bson';

// User in token user interface
export interface IUserInToken {
  email: string;
  userID: string;
  submissionID: string;
  role: string;
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
