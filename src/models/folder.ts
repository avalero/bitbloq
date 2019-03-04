import { Document, Model, model, Schema } from 'mongoose';
const timestamps = require('mongoose-timestamp');

interface IFolder extends Document {
  name?: string;
  user?: string;
  documentsID?: [string];
  foldersID?: [string];
  parent?: string;
}

const FolderMongSchema: Schema = new Schema({
  name: {
    type: String,
    default: 'New Folder',
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'UserModel',
  },

  documentsID: [
    {
      type: Schema.Types.ObjectId,
      ref: 'DocumentModel',
    },
  ],

  foldersID: [
    {
      type: Schema.Types.ObjectId,
      ref: 'FolderModel',
    },
  ],

  parent: {
    type: Schema.Types.ObjectId,
    ref: 'FolderModel',
  },
});

FolderMongSchema.plugin(timestamps);
export const FolderModel: Model<IFolder> = model<IFolder>(
  'FolderModel',
  FolderMongSchema,
);
