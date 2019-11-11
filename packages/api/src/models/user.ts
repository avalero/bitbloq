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
  bornDate?: Date;
  active?: boolean;
  signUpToken?: string;
  authToken?: string;
  notifications?: boolean;
  imTeacherCheck?: boolean;
  centerName?: string;
  educationalStage?: string;
  province?: string;
  postCode?: number;
  country?: string;
  rootFolder?: string;
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

  surnames: {
    type: String
  },

  bornDate: {
    type: Date
  },

  imTeacherCheck: {
    type: Boolean
  },

  centerName: {
    type: String
  },

  educationalStage: {
    type: String,
    enum: ["preschool", "primary", "secondary", "bachelor", "university"]
  },

  province: {
    type: String
  },

  postCode: {
    type: Number
  },

  country: {
    type: String
  },

  active: {
    type: Boolean
  },

  signUpToken: {
    type: String
  },

  authToken: {
    type: String
  },

  notifications: {
    type: Boolean
  },

  lastLogin: {
    type: Date
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
