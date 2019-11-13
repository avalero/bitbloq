import { Document, Model, model, Schema } from "mongoose";
const timestamps = require("mongoose-timestamp");

export interface IUpload extends Document {
  filename: string;
  mimetype: string;
  encoding: string;
  publicUrl: string;
  documentsID: string[];
  user: string;
  storageName: string;
  size: number;
  type: string;
  image?: string;
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IResource {
  id: string;
  title: string;
  type: string;
  thumbnail: string;
  preview: string;
  size: number;
}

const UploadMongSchema: Schema = new Schema({
  filename: String,
  mimetype: String,
  encoding: String,
  publicUrl: String,
  size: Number,
  image: String,
  storageName: String,
  type: { type: String, enum: ["image", "video", "sound", "object3D"] },
  deleted: { type: Boolean, default: false },
  documentsID: {
    type: [Schema.Types.ObjectId],
    ref: "DocumentModel"
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "UserModel"
  }
});

UploadMongSchema.plugin(timestamps);
export const UploadModel: Model<IUpload> = model<IUpload>(
  "UploadModel",
  UploadMongSchema
);
