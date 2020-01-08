import { Document, Model, model, Schema } from "mongoose";
import timestamps from "mongoose-timestamp";
import { CONTENT_VERSION } from "../config";
import { ICommonProps } from "./interfaces";

export interface IDocument extends ICommonProps, Document {
  parentFolder?: string;
  contentVersion?: number;
  advancedMode?: boolean;
  image?: { image: string; isSnapshot: boolean };
  public: boolean;
  example: boolean;
  version?: string;
  exResourcesID?: string[];
}

const documentMongSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "UserModel"
  },

  name: {
    type: String,
    default: ""
  },

  type: {
    type: String,
    required: true
  },

  parentFolder: {
    type: Schema.Types.ObjectId,
    ref: "FolderModel"
  },

  content: {
    type: String,
    default: "content"
  },

  contentVersion: {
    type: Number,
    default: CONTENT_VERSION
  },

  advancedMode: {
    type: Boolean,
    default: false
  },

  cache: {
    type: String,
    default: "cache"
  },

  image: {
    image: { type: String, default: "" },
    isSnapshot: {
      type: Boolean,
      default: true
    }
  },

  description: {
    type: String,
    default: ""
  },

  version: {
    type: String,
    default: "version"
  },

  public: {
    type: Boolean,
    default: false
  },

  example: {
    type: Boolean,
    default: false
  },
  resourcesID: {
    type: [Schema.Types.ObjectId],
    ref: "UploadModel"
  },
  exResourcesID: {
    type: [Schema.Types.ObjectId],
    ref: "UploadModel"
  }
});

documentMongSchema.plugin(timestamps);
export const DocumentModel: Model<IDocument> = model<IDocument>(
  "DocumentModel",
  documentMongSchema
);
