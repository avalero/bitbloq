import { Document, Model, model, Schema } from 'mongoose';
const timestamps = require('mongoose-timestamp');

interface IDocument extends Document {
  user?: string;
  title?: string;
  type?: string;
  content?: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
  description?: string;
  version: string;
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

  content: {
    type: String,
    default: 'content',
  },

  image: {
    type: String,
  },

  description: {
    type: String,
  },

  version: {
    type: String,
  },
});

DocumentMongSchema.plugin(timestamps);
export const DocumentModel: Model<IDocument> = model<IDocument>(
  'DocumentModel',
  DocumentMongSchema,
);
