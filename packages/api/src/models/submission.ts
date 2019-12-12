import { Document, Model, model, Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

export interface ISubmission extends Document {
  id: string;
  user?: string;
  title: string;
  exercise?: string;
  studentNick?: string;
  password?: string;
  content?: string;
  cache?: string;
  finished?: boolean;
  comment?: string;
  type: string;
  image: string;
  active: boolean;
}

const submissionMongSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "UserModel"
  },

  title: {
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
