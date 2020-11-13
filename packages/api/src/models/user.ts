import { Document, Model, model, Schema } from "mongoose";
// import {timestamps} from "mongoose-timestamp";
import timestamps from "mongoose-timestamp";
import { USER_PERMISSIONS } from "../config";

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  permissions: string[];
  name?: string;
  avatar?: string;
  surnames?: string;
  birthDate?: Date;
  active: boolean;
  signUpToken?: string;
  authToken?: string;
  notifications?: boolean;
  imTeacherCheck: boolean;
  centerName?: string;
  educationalStage?: string;
  city?: string;
  postCode?: string;
  country?: string;
  rootFolder?: string;
  lastLogin?: Date;
  finishedSignUp?: boolean;
  socialLogin: boolean;
  microsoftID?: string;
  googleID?: string;
}

export const contactSchema: Schema = new Schema({
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

  permissions: {
    type: [String],
    default: [USER_PERMISSIONS.basic]
  },

  name: {
    type: String
  },

  surnames: {
    type: String
  },

  avatar: { type: String },
  birthDate: {
    type: Date
  },

  active: {
    type: Boolean,
    default: false
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
    type: Boolean,
    default: false
  },

  imTeacherCheck: { type: Boolean, default: false },
  centerName: { type: String },
  educationalStage: { type: String },
  city: { type: String },
  postCode: { type: String },
  country: { type: String },

  lastLogin: {
    type: Date,
    default: new Date()
  },

  finishedSignUp: {
    type: Boolean,
    default: false
  },

  rootFolder: {
    type: Schema.Types.ObjectId,
    ref: "FolderModel"
  },

  socialLogin: {
    type: Boolean,
    default: false
  },

  microsoftID: {
    type: String
  },
  googleID: {
    type: String
  }
});

contactSchema.plugin(timestamps);
export const UserModel: Model<IUser> = model<Omit<IUser, "id">>(
  "UserModels",
  contactSchema
);
