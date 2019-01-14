import { Document, Schema, Model, model } from 'mongoose';
const timestamps = require('mongoose-timestamp');

interface ISubmission extends Document {
  user?: String;
  title: String;
  exercise_father?: String;
  student_nick?: String;
  content?: String;
  finished?: Boolean;
  comment?: String;
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

  exercise_father: {
    type: Schema.Types.ObjectId,
    ref: 'ExerciseModel',
  },

  student_nick: {
    type: String,
    default: 'aaaaa',
  },

  content: {
    //type: JSON,
    type: String,
    trim: true,
    default: 'content',
  },

  sub_token:{
    type: String,
    trim: true
  },

  finished: {
    type: Boolean,
    default: false,
  },

  comment: {
    type: String,
  },
});
SubmissionMongSchema.plugin(timestamps);
export const SubmissionModel: Model<ISubmission> = model<ISubmission>(
  'SubmissionModel',
  SubmissionMongSchema,
);
