import { Document, Model, model, Schema } from "mongoose";
const timestamps = require("mongoose-timestamp");

export interface IUser extends Document {
  email?: string;
  password?: string;
  admin?: boolean;
  publisher?: boolean;
  teacher?: boolean;
  teacherPro?: boolean;
  family?: boolean;
  name?: string;
  surnames?: string;
  birthDate?: Date;
  active?: boolean;
  signUpToken?: string;
  authToken?: string;
  notifications?: boolean;
  imTeacherCheck: boolean;
  centerName: string;
  educationalStage: string;
  province: string;
  postCode: string;
  country: string;
  rootFolder?: string;
  lastLogin?: Date;
  finishedSignUp?: boolean;
}

export const ContactSchema: Schema = new Schema({
  // id: Schema.Types.ObjectId,

  email: {
    type: String,
    unique: true,
    required: "Please enter your email",
    trim: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  admin: {
    type: Boolean,
    default: false
  },

  publisher: {
    type: Boolean,
    default: false
  },

  teacher: {
    type: Boolean,
    default: false
  },

  teacherPro: {
    type: Boolean,
    default: false
  },

  family: {
    type: Boolean,
    default: false
  },

  name: {
    type: String
  },

  surnames: {
    type: String
  },

  birthDate: {
    type: Date
  },

  active: {
    type: Boolean
  },

  signUpToken: {
    type: String,
    default: "aa"
  },

  authToken: {
    type: String,
    default: "aa"
  },

  notifications: {
    type: Boolean
  },

  imTeacherCheck: { type: Boolean, default: false },
  centerName: { type: String },
  educationalStage: { type: String },
  province: { type: String },
  postCode: { type: String },
  country: { type: String },

  lastLogin: {
    type: Date
  },

  finishedSignUp: {
    type: Boolean,
    default: false
  },

  rootFolder: {
    type: Schema.Types.ObjectId,
    ref: "FolderModel"
  }
});

ContactSchema.plugin(timestamps);
export const UserModel: Model<IUser> = model<IUser>(
  "UserModels",
  ContactSchema
);
