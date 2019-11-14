import { ApolloError } from "apollo-server-koa";
import { uploadModel, IUpload, IResource } from "../models/upload";
import { orderFunctions } from "../utils";
import { documentModel } from "../models/document";
import { IUserInToken } from "../models/interfaces";
import {
  IQueryCloudResourcesArgs,
  IMutationUploadCloudResourceArgs,
  IMutationAddResourceToDocumentArgs,
  IMutationMoveToTrashArgs,
  IMutationRestoreResourceArgs
} from "../api-types";

import * as fs from "fs";
const { Storage } = require("@google-cloud/storage");

const storage = new Storage(process.env.GCLOUD_PROJECT_ID); // project ID
const bucket = storage.bucket(String(process.env.GCLOUD_STORAGE_BUCKET)); // bucket name
const bucketName: string = process.env.GCLOUD_STORAGE_BUCKET;

let publicUrl: string;
let fileSize: number;

const acceptedFiles = {
  image: [".png", ".gif", ".jpg", ".jpeg", "webp"],
  video: [".mp4", ".webm"],
  sound: [".mp3", ".ocg"],
  object3D: [".stl"]
};

const normalize = (() => {
  const from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
  const to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
  const mapping = {};

  for (let i = 0, j = from.length; i < j; i++) {
    mapping[from.charAt(i)] = to.charAt(i);
  }

  return (str: string) => {
    const ret = [];
    for (let i = 0, j = str.length; i < j; i++) {
      const c = str.charAt(i);
      if (mapping.hasOwnProperty(str.charAt(i))) {
        ret.push(mapping[c]);
      } else {
        ret.push(c);
      }
    }
    return ret
      .join("")
      .replace(/[^-A-Za-z0-9]+/g, "-")
      .toLowerCase();
  };
})();

const processUpload = async (
  resolve: any,
  reject: any,
  createReadStream: any,
  gcsName: string,
  documentID?: string,
  filename?: string,
  mimetype?: string,
  encoding?: string,
  userID?: string,
  type?: string
) => {
  const file = bucket.file(gcsName);

  const opts = {
    metadata: {
      cacheControl: "private, max-age=0, no-transform"
    }
  };
  const fileStream = createReadStream();
  const gStream = file.createWriteStream(opts);
  gStream
    .on("error", err => {
      reject(new ApolloError("Error uploading file", "UPLOAD_ERROR"));
    })
    .on("finish", async err => {
      if (err) {
        throw new ApolloError("Error uploading file", "UPLOAD_ERROR");
      }

      file.makePublic().then(async () => {
        publicUrl = getPublicUrl(gcsName);
        fileSize = Number(getFilesizeInBytes(createReadStream().path));
        if (fileSize > 10000000) {
          throw new ApolloError(
            "Upload error, image too big.",
            "UPLOAD_SIZE_ERROR"
          );
        }
        const uploadNew = new uploadModel({
          document: documentID,
          filename,
          mimetype,
          encoding,
          publicUrl,
          storageName: gcsName,
          size: fileSize,
          user: userID,
          image: type === "image" ? publicUrl : null,
          type,
          deleted: false
        });
        const uploaded: IUpload = await uploadModel.create(uploadNew);
        resolve(uploaded);
      });
    });

  fileStream.pipe(gStream);
};

function getPublicUrl(filename) {
  return `https://storage.googleapis.com/${bucketName}/${filename}`;
}

export function getFilesizeInBytes(filename) {
  try {
    const stats = fs.statSync(filename);
    const fileSizeInBytes: number = stats["size"];
    return fileSizeInBytes;
  } catch (e) {
    return "";
  }
}

export async function uploadDocumentImage(
  image: any,
  documentID: string,
  userID: string
): Promise<IUpload> {
  const { createReadStream, filename, mimetype, encoding } = await image;
  if (!createReadStream || !filename || !mimetype || !encoding) {
    throw new ApolloError("Upload error, check file type.", "UPLOAD_ERROR");
  }
  if (String(mimetype).indexOf("image") === -1) {
    throw new ApolloError(
      "Upload error, check image format.",
      "UPLOAD_FORMAT_ERROR"
    );
  }
  if (getFilesizeInBytes(createReadStream().path) > 2000000) {
    // 2megas
    throw new ApolloError("Upload error, image too big.", "UPLOAD_SIZE_ERROR");
  }
  const uniqueName: string = documentID + normalize(filename);
  const gcsName: string = `${userID}/${encodeURIComponent(uniqueName)}`;

  return new Promise((resolve, reject) => {
    processUpload(
      resolve,
      reject,
      createReadStream,
      gcsName,
      documentID,
      filename,
      mimetype,
      encoding,
      userID,
      "image"
    );
  });
}

const uploadResolver = {
  Query: {
    uploads: () => uploadModel.find({}),
    getUserFiles: async (_, __, context: { user: IUserInToken }) => {
      const [files] = await bucket.getFiles({
        prefix: `${context.user.userID}`
      });
      files.forEach(async file => {
        await file.getMetadata().then(result => {
          // console.log(file.name);
          // console.log(result[0].size);
        });
      });
      return uploadModel.find({ user: context.user.userID });
    },

    cloudResources: async (
      _,
      args: IQueryCloudResourcesArgs,
      context: { user: IUserInToken }
    ) => {
      const itemsPerPage: number = 8;
      const skipN: number = (args.currentPage - 1) * itemsPerPage;
      const limit: number = skipN + itemsPerPage;
      const text: string = args.searchTitle;

      const orderFunction = orderFunctions[args.order];
      let filtedOptions = {};
      args.deleted
        ? (filtedOptions = {
            deleted: true
          })
        : (filtedOptions = {
            type: { $in: args.type },
            deleted: false
          });
      const userUploads: IUpload[] = await uploadModel.find({
        filename: { $regex: `.*${text}.*`, $options: "i" },
        user: context.user.userID,
        ...filtedOptions
      });

      const resources: IResource[] = userUploads.map(i => {
        return {
          id: i._id,
          title: i.filename,
          type: i.type,
          size: i.size,
          thumbnail: i.image,
          preview: i.image,
          file: i.publicUrl,
          deleted: i.deleted,
          createdAt: i.createdAt
        };
      });
      const pagesNumber: number = Math.ceil(resources.length / itemsPerPage);
      const result: IResource[] = await resources
        .sort(orderFunction)
        .slice(skipN, limit);

      return { resources: result, pagesNumber };
    }
  },
  Mutation: {
    singleUpload: async (file, documentID: string, userID: string) => {
      const { createReadStream, filename, mimetype, encoding } = await file;
      if (!createReadStream || !filename || !mimetype || !encoding) {
        throw new ApolloError("Upload error, check file type.", "UPLOAD_ERROR");
      }
      const uniqueName: string = Date.now() + normalize(filename);
      const gcsName: string = `${userID}/${encodeURIComponent(uniqueName)}`;
      return new Promise((resolve, reject) => {
        processUpload(
          resolve,
          reject,
          createReadStream,
          gcsName,
          documentID,
          filename,
          mimetype,
          encoding,
          userID,
          ""
        );
      });
    },
    uploadCloudResource: async (
      _,
      args: any,
      context: { user: IUserInToken }
    ) => {
      const {
        createReadStream,
        filename,
        mimetype,
        encoding
      } = await args.file;
      if (!createReadStream || !filename || !mimetype || !encoding) {
        throw new ApolloError("Upload error, check file type.", "UPLOAD_ERROR");
      }
      let fileType: string = "";
      for (const type in acceptedFiles) {
        if (acceptedFiles.hasOwnProperty(type)) {
          for (const item of acceptedFiles[type]) {
            if (filename.indexOf(item) > -1) {
              fileType = type;
              break;
            }
          }
        }
      }
      if (fileType === "") {
        throw new ApolloError(
          "Upload error, check file format",
          "UPLOAD_FORMAT_ERROR"
        );
      }
      const uniqueName: string = Date.now() + normalize(filename);
      const gcsName: string = `${context.user.userID}/${encodeURIComponent(
        uniqueName
      )}`;
      return new Promise((resolve, reject) => {
        processUpload(
          resolve,
          reject,
          createReadStream,
          gcsName,
          undefined,
          filename,
          mimetype,
          encoding,
          context.user.userID,
          fileType
        );
      });
    },
    uploadSTLFile: async (_, args: any, context: { user: IUserInToken }) => {
      const {
        createReadStream,
        filename,
        mimetype,
        encoding
      } = await args.file;

      if (!createReadStream || !filename || !mimetype || !encoding) {
        throw new ApolloError("Upload error, check file type.", "UPLOAD_ERROR");
      }
      if (String(filename).indexOf("stl") === -1) {
        throw new ApolloError(
          "Upload error, check file format. It must be an STL",
          "UPLOAD_FORMAT_ERROR"
        );
      }
      const uniqueName: string = Date.now() + normalize(filename);
      const gcsName: string = `${context.user.userID}/${encodeURIComponent(
        uniqueName
      )}`;
      return new Promise((resolve, reject) => {
        processUpload(
          resolve,
          reject,
          createReadStream,
          gcsName,
          args.documentID,
          filename,
          mimetype,
          encoding,
          context.user.userID,
          "object3D"
        );
      });
    },

    addResourceToDocument: async (
      _,
      args: IMutationAddResourceToDocumentArgs,
      context: { user: IUserInToken }
    ) => {
      await documentModel.findOneAndUpdate(
        { _id: args.documentID },
        { $push: { resourcesID: args.resourceID } },
        { new: true }
      );
      return uploadModel.findOneAndUpdate(
        { _id: args.resourceID, deleted: false },
        { $push: { documentsID: args.documentID } },
        { new: true }
      );
    },

    uploadImageFile: async (_, args: any, context: { user: IUserInToken }) => {
      const {
        createReadStream,
        filename,
        mimetype,
        encoding
      } = await args.file;
      if (!createReadStream || !filename || !mimetype || !encoding) {
        throw new ApolloError("Upload error, check file type.", "UPLOAD_ERROR");
      }
      const uniqueName: string = Date.now() + normalize(filename);
      const gcsName: string = `${context.user.userID}/${encodeURIComponent(
        uniqueName
      )}`;
      return new Promise((resolve, reject) => {
        processUpload(
          resolve,
          reject,
          createReadStream,
          gcsName,
          args.documentID,
          filename,
          mimetype,
          encoding,
          context.user.userID,
          "image"
        );
      });
    },
    deleteUserFile: async (_, args: any, context: { user: IUserInToken }) => {
      if (args.filename) {
        await bucket.file(`${context.user.userID}/${args.filename}`).delete();
        return uploadModel.deleteOne({
          publicUrl: {
            $regex: `${context.user.userID}/${args.filename}`,
            $options: "i"
          }
        });
      }
    },
    moveToTrash: async (
      _,
      args: IMutationMoveToTrashArgs,
      context: { user: IUserInToken }
    ) => {
      const uploaded: IUpload = await uploadModel.findOne({
        _id: args.id,
        user: context.user.userID
      });
      if (!uploaded) {
        throw new ApolloError("File not found", "FILE_NOT_FOUND");
      }
      return uploadModel.findOneAndUpdate(
        { _id: uploaded._id },
        { $set: { deleted: true } },
        { new: true }
      );
    },
    restoreResource: async (
      _,
      args: IMutationRestoreResourceArgs,
      context: { user: IUserInToken }
    ) => {
      const uploaded: IUpload = await uploadModel.findOne({
        _id: args.id,
        user: context.user.userID
      });
      if (!uploaded) {
        throw new ApolloError("File not found", "FILE_NOT_FOUND");
      }
      return uploadModel.findOneAndUpdate(
        { _id: uploaded._id },
        { $set: { deleted: false } },
        { new: true }
      );
    }
  },
  Upload: {
    documents: async (_, upload: IUpload) => {
      return documentModel.find({ _id: { $in: upload.documentsID } });
    }
  }
};

export default uploadResolver;
