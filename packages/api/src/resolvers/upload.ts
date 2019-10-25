import { ApolloError } from "apollo-server-koa";
import { UploadModel } from "../models/upload";
import { urlencoded } from "express";

const fs = require("fs"); //Load the filesystem module
const { Storage } = require("@google-cloud/storage");

const storage = new Storage(process.env.GCLOUD_PROJECT_ID); // project ID
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET); // bucket name
const bucketName: string = process.env.GCLOUD_STORAGE_BUCKET;

let publicUrl: string, fileSize: number;

const normalize = (function() {
  let from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
    to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
    mapping = {};

  for (let i = 0, j = from.length; i < j; i++)
    mapping[from.charAt(i)] = to.charAt(i);

  return function(str) {
    let ret = [];
    for (let i = 0, j = str.length; i < j; i++) {
      let c = str.charAt(i);
      if (mapping.hasOwnProperty(str.charAt(i))) ret.push(mapping[c]);
      else ret.push(c);
    }
    return ret
      .join("")
      .replace(/[^-A-Za-z0-9]+/g, "-")
      .toLowerCase();
  };
})();

const processUpload = async (createReadStream, uniqueName, resolve, reject) => {
  const file = bucket.file(uniqueName);

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
        publicUrl = getPublicUrl(uniqueName);
        resolve("OK");
      });
    });

  fileStream.pipe(gStream);
};

function getPublicUrl(filename) {
  //const finalName: string = encodeURIComponent(filename);
  return `https://storage.googleapis.com/${bucketName}/${filename}`;
}

function getFilesizeInBytes(filename) {
  try {
    const stats = fs.statSync(filename);
    const fileSizeInBytes: number = stats["size"];
    return fileSizeInBytes / 1000000;
  } catch (e) {
    console.log(e);
  }
}

export async function uploadDocumentImage(image, documentID, userID) {
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
  if (getFilesizeInBytes(createReadStream().path) > 2) {
    // 2megas
    throw new ApolloError("Upload error, image too big.", "UPLOAD_SIZE_ERROR");
  }
  const uniqueName: string = documentID + normalize(filename);
  const gcsName: string = `${userID}/${encodeURIComponent(uniqueName)}`;

  await new Promise((resolve, reject) => {
    processUpload(createReadStream, gcsName, resolve, reject);
  });
  const uploadNew = new UploadModel({
    document: documentID,
    filename,
    mimetype,
    encoding,
    publicUrl,
    gcsName,
    size: fileSize,
    user: userID
  });
  return UploadModel.create(uploadNew);
}

const uploadResolver = {
  Query: {
    uploads: () => UploadModel.find({}),
    getUserFiles: async (root: any, args: any, context: any) => {
      //console.log(bucket)
      const [files] = await bucket.getFiles({
        prefix: `${context.user.userID}`
      });
      console.log("Files:");
      files.forEach(async file => {
        await file.getMetadata().then(result => {
          console.log(file.name);
          console.log(result[0].size);
        });
      });
      return await UploadModel.find({ user: context.user.userID });
    }
  },
  Mutation: {
    singleUpload: async (file, documentID, userID) => {
      const { createReadStream, filename, mimetype, encoding } = await file;
      if (!createReadStream || !filename || !mimetype || !encoding) {
        throw new ApolloError("Upload error, check file type.", "UPLOAD_ERROR");
      }
      const uniqueName: string = Date.now() + normalize(filename);
      const gcsName: string = `${userID}/${encodeURIComponent(uniqueName)}`;
      await new Promise((resolve, reject) => {
        processUpload(createReadStream, gcsName, resolve, reject);
      });
      const uploadNew = new UploadModel({
        document: documentID,
        filename,
        mimetype,
        encoding,
        publicUrl,
        gcsName,
        size: fileSize,
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
      await new Promise((resolve, reject) => {
        processUpload(createReadStream, gcsName, resolve, reject);
      });
      const uploadNew = new UploadModel({
        document: args.documentID,
        filename,
        mimetype,
        encoding,
        publicUrl,
        user: context.user.userID,
        gcsName,
        size: fileSize
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
      const uniqueName: string = Date.now() + normalize(filename);
      const gcsName: string = `${context.user.userID}/${encodeURIComponent(
        uniqueName
      )}`;
      await new Promise((resolve, reject) => {
        processUpload(createReadStream, gcsName, resolve, reject);
      });
      const uploadNew = new UploadModel({
        document: args.documentID,
        filename,
        mimetype,
        encoding,
        publicUrl,
        user: context.user.userID,
        gcsName,
        size: fileSize
      });
      return UploadModel.create(uploadNew);
    },
    deleteUserFile: async (root: any, args: any, context: any) => {
      if (args.filename) {
        await bucket.file(`${context.user.userID}/${args.filename}`).delete();
        return await UploadModel.deleteOne({
          publicUrl: {
            $regex: `${context.user.userID}/${args.filename}`,
            $options: "i"
          }
        });
      }
    }
  }
};

export default uploadResolver;
