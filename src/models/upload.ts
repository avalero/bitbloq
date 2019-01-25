import { Document, Schema, Model, model } from 'mongoose';
const timestamps = require('mongoose-timestamp');

interface IUpload extends Document {
  filename: String;
  mimetype: String;
  encoding: String;
  publicURL: String;
  document: String;
  createdAt?: Date;
  updatedAt?: Date;
}

const UploadMongSchema: Schema = new Schema({
  filename: String,
  mimetype: String,
  encoding: String,
  publicURL: String,
  document: {
    type: Schema.Types.ObjectId,
    ref: 'DocumentModel',
  },
});

UploadMongSchema.plugin(timestamps);
export const UploadModel: Model<IUpload> = model<IUpload>(
  'UploadModel',
  UploadMongSchema,
);
