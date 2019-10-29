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
  center?: string;
  active?: boolean;
  signUpToken?: string;
  authToken?: string;
  notifications?: boolean;
  signUpSurvey?: JSON;
  rootFolder?: Date;
  lastLogin?: string;
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

  center: {
    type: String
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

  lastLogin: {
    type: Date
  },

  signUpSurvey: {
    type: Schema.Types.Mixed
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
