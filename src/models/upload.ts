import { Document, Model, model, Schema } from 'mongoose';
const timestamps = require('mongoose-timestamp');

export interface IUpload extends Document {
  filename: string;
  mimetype: string;
  encoding: string;
  publicUrl: string;
  document: string;
  user: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UploadMongSchema: Schema = new Schema({
  filename: String,
  mimetype: String,
  encoding: String,
  publicUrl: String,
  document: {
    type: Schema.Types.ObjectId,
    ref: 'DocumentModel',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'UserModel',
  },
});

UploadMongSchema.plugin(timestamps);
export const UploadModel: Model<IUpload> = model<IUpload>(
  'UploadModel',
  UploadMongSchema,
);
