import { ApolloError } from "apollo-server-koa";
import { UploadModel } from "../models/upload";

const { Storage } = require("@google-cloud/storage");

const storage = new Storage(process.env.GCLOUD_PROJECT_ID); // project ID
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET); // bucket name
const bucketName: string = process.env.GCLOUD_STORAGE_BUCKET;

let publicUrl: string;

const processUpload = async (
  createReadStream,
  filename,
  userID,
  resolve,
  reject
) => {
  const uniqueName: string = Date.now() + filename;
  const gcsName: string = `${userID}/${encodeURIComponent(uniqueName)}`;
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

      file.makePublic().then(() => {
        publicUrl = getPublicUrl(gcsName);
        resolve("OK");
      });
    });

  fileStream.pipe(gStream);
};

function getPublicUrl(filename) {
  //const finalName: string = encodeURIComponent(filename);
  return `https://storage.googleapis.com/${bucketName}/${filename}`;
}

const uploadResolver = {
  Query: {
    uploads: () => UploadModel.find({})
  },
  Mutation: {
    singleUpload: async (file, documentID, userID) => {
      const { createReadStream, filename, mimetype, encoding } = await file;
      if (!createReadStream || !filename || !mimetype || !encoding) {
        throw new ApolloError("Upload error, check file type.", "UPLOAD_ERROR");
      }
      await new Promise((resolve, reject) => {
        processUpload(createReadStream, filename, userID, resolve, reject);
      });
      const uploadNew = new UploadModel({
        document: documentID,
        filename,
        mimetype,
        encoding,
        publicUrl,
        user: userID
      });
      return UploadModel.create(uploadNew);
    },
    uploadSTLFile: async (root: any, args: any, context: any) => {
      const {
        createReadStream,
        filename,
        mimetype,
        encoding
      } = await args.file;
      if (!createReadStream || !filename || !mimetype || !encoding) {
        throw new ApolloError("Upload error, check file type.", "UPLOAD_ERROR");
      }
      await new Promise((resolve, reject) => {
        processUpload(
          createReadStream,
          filename,
          context.user.userID,
          resolve,
          reject
        );
      });
      const uploadNew = new UploadModel({
        document: args.documentID,
        filename,
        mimetype,
        encoding,
        publicUrl,
        user: context.user.userID
      });
      return UploadModel.create(uploadNew);
    },
    uploadImageFile: async (root: any, args: any, context: any) => {
      const {
        createReadStream,
        filename,
        mimetype,
        encoding
      } = await args.file;
      if (!createReadStream || !filename || !mimetype || !encoding) {
        throw new ApolloError("Upload error, check file type.", "UPLOAD_ERROR");
      }
      await new Promise((resolve, reject) => {
        processUpload(
          createReadStream,
          filename,
          args.user.userID,
          resolve,
          reject
        );
      });
      const uploadNew = new UploadModel({
        document: args.documentID,
        filename,
        mimetype,
        encoding,
        publicUrl,
        user: context.user.userID
      });
      return UploadModel.create(uploadNew);
    }
  }
};

export default uploadResolver;
