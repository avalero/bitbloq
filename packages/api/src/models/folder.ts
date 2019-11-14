import { Document, Model, model, Schema } from "mongoose";
import * as timestamps from "mongoose-timestamp";

export interface IFolder extends Document {
  name?: string;
  user?: string;
  documentsID?: [string];
  foldersID?: [string];
  parent?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const folderMongSchema: Schema = new Schema({
  name: {
    type: String,
    default: "New Folder"
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "UserModel"
  },

  documentsID: [
    {
      type: Schema.Types.ObjectId,
      ref: "DocumentModel"
    }
  ],

  foldersID: [
    {
      type: Schema.Types.ObjectId,
      ref: "FolderModel"
    }
  ],

  parent: {
    type: Schema.Types.ObjectId,
    ref: "FolderModel"
  }
});

folderMongSchema.plugin(timestamps);
export const FolderModel: Model<IFolder> = model<IFolder>(
  "FolderModel",
  folderMongSchema
);
