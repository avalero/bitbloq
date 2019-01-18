import { Document, Schema, Model, model } from 'mongoose';
const timestamps = require('mongoose-timestamp');

interface IDocument extends Document {
  user?: String;
  title?: String;
  type?: String;
  content?: String;
  image?: { Mixed };
  createdAt?: Date;
  updatedAt?: Date;
  description?: String;
  version: String;
}

const DocumentMongSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'UserModel',
  },

  title: {
    type: String,
    trim: true,
  },

  type: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    trim: true,
    default: 'content',
  },

  image: {
    type: String,
    default: 'default',
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
