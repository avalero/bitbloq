import { Document, Model, model, Schema } from "mongoose";
import timestamps from "mongoose-timestamp";
import { CONTENT_VERSION } from "../config";
import { ICommonProps } from "./interfaces";

export interface ISubmission extends ICommonProps, Document {
  id: string;
  exercise?: string;
  studentNick?: string;
  password?: string;
  contentVersion?: number;
  finished?: boolean;
  comment?: string;
  image: string;
  active: boolean;
}

const submissionMongSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "UserModel"
  },

  name: {
    type: String,
    default: "New Submission"
  },

  exercise: {
    type: Schema.Types.ObjectId,
    ref: "ExerciseModel"
  },

  document: {
    type: Schema.Types.ObjectId,
    ref: "DocumentModel"
  },

  teacherID: {
    type: Schema.Types.ObjectId,
    ref: "UserModel"
  },

  studentNick: {
    type: String,
    required: true
  },

  password: {
    type: String
  },

  content: {
    type: String,
    default: "content"
  },

  contentVersion: {
    type: Number,
    default: CONTENT_VERSION
  },

  cache: {
    type: String,
    default: "cache"
  },

  submissionToken: {
    type: String
  },

  finished: {
    type: Boolean,
    default: false
  },

  active: {
    type: Boolean,
    default: false
  },

  type: {
    type: String
  },

  studentComment: {
    type: String,
    default: "studentComment"
  },

  finishedAt: {
    type: Date
  },

  grade: {
    type: Number
  },

  teacherComment: {
    type: String,
    default: "teacherComment"
  },

  gradedAt: {
    type: Date
  }
});
submissionMongSchema.plugin(timestamps);
export const SubmissionModel: Model<ISubmission> = model<ISubmission>(
  "SubmissionModel",
  submissionMongSchema
);
