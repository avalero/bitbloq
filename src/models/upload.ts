import { Document, Model, model, Schema } from 'mongoose';
const timestamps = require('mongoose-timestamp');

interface IUpload extends Document {
  filename: string;
  mimetype: string;
  encoding: string;
  publicUrl: string;
  document: string;
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
});

UploadMongSchema.plugin(timestamps);
export const UploadModel: Model<IUpload> = model<IUpload>(
  'UploadModel',
  UploadMongSchema,
);
