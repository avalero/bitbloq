import { Document, Model, model, Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

export interface IDocument extends Document {
  user?: string;
  title?: string;
  type?: string;
  folder?: string;
  content?: string;
  advancedMode?: boolean;
  cache?: string;
  image?: { image: string; isSnapshot: boolean };
  public: boolean;
  example: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  description?: string;
  version?: string;
  resourcesID?: string[];
}

const documentMongSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "userModel"
  },

  title: {
    type: String,
    default: ""
  },

  type: {
    type: String,
    required: true
  },

  folder: {
    type: Schema.Types.ObjectId,
    ref: "FolderModel"
  },

  content: {
    type: String,
    default: "content"
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
  }
});

documentMongSchema.plugin(timestamps);
export const documentModel: Model<IDocument> = model<IDocument>(
  "documentModel",
  documentMongSchema
);
