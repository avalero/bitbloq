import { Document, Model, model, Schema } from "mongoose";
import timestamps from "mongoose-timestamp";
import { CONTENT_VERSION } from "../config";

export interface IExercise extends Document {
  user?: string;
  document?: string;
  code?: string;
  title?: string;
  type?: string;
  description: string;
  teacherName: string;
  content?: string;
  contentVersion?: number;
  cache?: string;
  acceptSubmissions?: boolean;
  expireDate?: Date;
  image: string;
  resourcesID: string[];
}

const exerciseMongSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "UserModel"
  },

  document: {
    type: Schema.Types.ObjectId,
    ref: "DocumentModel"
  },

  resourcesID: {
    type: [Schema.Types.ObjectId],
    ref: "UploadModel"
  },

  code: {
    type: String,
    default: "111111"
  },

  title: {
    type: String,
    default: "New Exercise"
  },

  type: {
    type: String
  },

  description: {
    type: String
  },

  teacherName: {
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
    type: String
  },

  acceptSubmissions: {
    type: Boolean,
    default: true
  },

  image: String,

  expireDate: {
    type: Date,
    default: new Date(3000, 12, 30) // fecha de caducidad por defecto
  }
});
exerciseMongSchema.plugin(timestamps);
export const ExerciseModel: Model<IExercise> = model<IExercise>(
  "ExerciseModel",
  exerciseMongSchema
);
