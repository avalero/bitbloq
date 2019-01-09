//import * as mongoose from 'mongoose';
import { Document, Schema, Model, model } from 'mongoose';
const timestamps = require('mongoose-timestamp');

interface IExercise extends Document {
  user?: String;
  document_father?: String;
  code?: String;
  title?: String;
  versions?: [String];
  submissions?: [String];
  expireDate?: String;
}

const ExerciseMongSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'UserModel',
  },

  document_father: {
    type: Schema.Types.ObjectId,
    ref: 'DocumentModel',
  },

  code: {
    type: String,
    default: '111111',
  },

  title: {
    type: String,
    default: 'New Exercise',
  },

  versions: [
    {
      id: String,
      content: String,
      date: String,
    },
  ],

  expireDate: {
    type: String,
  },
});
ExerciseMongSchema.plugin(timestamps);
export const ExerciseModel: Model<IExercise> = model<IExercise>(
  'ExerciseModel',
  ExerciseMongSchema,
);
