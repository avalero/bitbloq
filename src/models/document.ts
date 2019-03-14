import { Document, Model, model, Schema } from 'mongoose';
const timestamps = require('mongoose-timestamp');

interface IDocument extends Document {
  user?: string;
  title?: string;
  type?: string;
  folder?: string;
  content?: string;
  cache?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
  description?: string;
  version?: string;
}

const DocumentMongSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'UserModel',
  },

  title: {
    type: String,
    default: 'New document',
  },

  type: {
    type: String,
    required: true,
  },

  folder: {
    type: Schema.Types.ObjectId,
    ref: 'FolderModel',
  },

  content: {
    type: String,
    default: 'content',
  },

  cache: {
    type: String,
    default: 'cache',
  },

  image: {
    type: String,
    default: 'imageURL'
  },

  description: {
    type: String,
    default: 'description'
  },

  version: {
    type: String,
    default: 'version'
  },
});

DocumentMongSchema.plugin(timestamps);
export const DocumentModel: Model<IDocument> = model<IDocument>(
  'DocumentModel',
  DocumentMongSchema,
);
