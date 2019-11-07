import { ApolloError } from "apollo-server-koa";
import { UploadModel, IUpload, IResource } from "../models/upload";
import { orderFunctions } from "../utils";

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
        fileSize = getFilesizeInBytes(createReadStream().path);
        const uploadNew = new UploadModel({
          document: documentID,
          filename,
          mimetype,
          encoding,
          publicUrl,
          storageName: gcsName,
          size: fileSize,
          user: userID,
          image: type === "images" ? publicUrl : null,
          type: type,
          deleted: false
        });
        console.log(fileSize, type);
        const uploaded: IUpload = await UploadModel.create(uploadNew);
        resolve(uploaded);
      });
    });

  fileStream.pipe(gStream);
};

function getPublicUrl(filename) {
  //const finalName: string = encodeURIComponent(filename);
  return `https://storage.googleapis.com/${bucketName}/${filename}`;
}

export function getFilesizeInBytes(filename) {
  try {
    const stats = fs.statSync(filename);
    const fileSizeInBytes: number = stats["size"];
    return fileSizeInBytes;
  } catch (e) {
    console.log(e);
  }
}

export async function uploadDocumentImage(image, documentID, userID): Promise<IUpload> {
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

  return await new Promise((resolve, reject) => {
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
      "images"
    );
  });
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
    },

    cloudResources: async (root: any, args: any, context: any) => {
      const itemsPerPage: number = 8;
      let skipN: number = (args.currentPage - 1) * itemsPerPage;
      let limit: number = skipN + itemsPerPage;
      const text: string = args.searchTitle;

      const orderFunction = orderFunctions[args.order];
      let filtedOptions = {};
      args.deleted
        ? (filtedOptions = {
            deleted: true
          })
        : (filtedOptions = {
            type: args.type,
            deleted: false
          });
      const userUploads: IUpload[] = await UploadModel.find({
        filename: { $regex: `.*${text}.*`, $options: "i" },
        user: context.user.userID,
        ...filtedOptions
      });
      const dataSorted: IUpload[] = await userUploads.sort(orderFunction);
      const pagesNumber: number = Math.ceil(dataSorted.length / itemsPerPage);

      const result: IResource[] = dataSorted.slice(skipN, limit).map(i => {
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
      return { resources: result, pagesNumber };
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
      return await new Promise((resolve, reject) => {
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
      return await new Promise((resolve, reject) => {
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
          "objects3D"
        );
      });
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
      return await new Promise((resolve, reject) => {
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
          "images"
        );
      });
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
    },
    moveToTrash: async (root: any, args: any, context: any) => {
      const uploaded: IUpload = await UploadModel.findOne({
        _id: args.id,
        user: context.user.userID
      });
      if (!uploaded) {
        throw new ApolloError("File not found", "FILE_NOT_FOUND");
      }
      return await UploadModel.findOneAndUpdate(
        { _id: uploaded._id },
        { $set: { deleted: true } },
        { new: true }
      );
    },
    restoreResource: async (root: any, args: any, context: any) => {
      const uploaded: IUpload = await UploadModel.findOne({
        _id: args.id,
        user: context.user.userID
      });
      if (!uploaded) {
        throw new ApolloError("File not found", "FILE_NOT_FOUND");
      }
      return await UploadModel.findOneAndUpdate(
        { _id: uploaded._id },
        { $set: { deleted: false } },
        { new: true }
      );
    }
  }
};

export default uploadResolver;
