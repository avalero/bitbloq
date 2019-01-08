import * as mongoose from 'mongoose';
import { Document, Schema, Model } from 'mongoose';

interface IExercise extends Document {
  document_father?: String;
  code?: String;
  title?: String;
  versions?: [String];
  submissions?: [String];
  expireDate?: String;
}

const ExerciseMongSchema: Schema = new Schema({
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

  submission: [
    {
      id: String,
      studentNick: String,
      content: String,
      date: String,
      finished: Boolean,
      comment: String,
    },
  ],

  expireDate: {
    type: String,
  },
});

export const ExerciseModel: Model<IExercise> = mongoose.model<IExercise>(
  'ExerciseModel',
  ExerciseMongSchema,
);
