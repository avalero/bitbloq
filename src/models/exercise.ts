import { Document, Model, model, Schema } from 'mongoose';
const timestamps = require('mongoose-timestamp');

interface IExercise extends Document {
  user?: string;
  document?: string;
  code?: string;
  title?: string;
  type?: string;
  description: string;
  teacherName: string;
  content?: string;
  cache?: string;
  acceptSubmissions?: boolean;
  expireDate?: Date;
  image: string;
}

const ExerciseMongSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'UserModel',
  },

  document: {
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

  type: {
    type: String,
  },

  description: {
    type: String,
  },

  teacherName: {
    type: String,
  },

  content: {
    type: String,
    default: 'content',
  },

  cache: {
    type: String,
  },

  acceptSubmissions: {
    type: Boolean,
    default: true,
  },

  image: String,

  expireDate: {
    type: Date,
    default: new Date(3000, 12, 30), // fecha de caducidad por defecto
  },
});
ExerciseMongSchema.plugin(timestamps);
export const ExerciseModel: Model<IExercise> = model<IExercise>(
  'ExerciseModel',
  ExerciseMongSchema,
);
