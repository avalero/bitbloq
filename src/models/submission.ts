import { Document, Schema, Model, model } from 'mongoose';
const timestamps = require('mongoose-timestamp');

interface ISubmission extends Document {
  user?: String;
  title: String;
  exercise?: String;
  studentNick?: String;
  content?: String;
  finished?: Boolean;
  comment?: String;
  type: String;
}

const SubmissionMongSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'UserModel',
  },

  title: {
    type: String,
    default: 'New Submission',
  },

  exercise: {
    type: Schema.Types.ObjectId,
    ref: 'ExerciseModel',
  },

  studentNick: {
    type: String,
    default: 'aaaaa',
  },

  content: {
    type: String,
    trim: true,
    default: 'content',
  },

  submissionToken: {
    type: String,
    trim: true,
  },

  finished: {
    type: Boolean,
    default: false,
  },

  type: {
    type: String,
  },

  comment: {
    type: String,
  },

  finishedAt: {
    type: Date,
  },
});
SubmissionMongSchema.plugin(timestamps);
export const SubmissionModel: Model<ISubmission> = model<ISubmission>(
  'SubmissionModel',
  SubmissionMongSchema,
);
