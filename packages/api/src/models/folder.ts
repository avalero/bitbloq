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
    ref: "userModel"
  },

  documentsID: [
    {
      type: Schema.Types.ObjectId,
      ref: "documentModel"
    }
  ],

  foldersID: [
    {
      type: Schema.Types.ObjectId,
      ref: "folderModel"
    }
  ],

  parent: {
    type: Schema.Types.ObjectId,
    ref: "folderModel"
  }
});

folderMongSchema.plugin(timestamps);
export const folderModel: Model<IFolder> = model<IFolder>(
  "folderModel",
  folderMongSchema
);
