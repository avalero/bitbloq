import { Document, Model, model, Schema } from "mongoose";
// import {timestamps} from "mongoose-timestamp";
import timestamps from "mongoose-timestamp";

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  admin?: boolean;
  publisher?: boolean;
  teacher?: boolean;
  teacherPro?: boolean;
  family?: boolean;
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
