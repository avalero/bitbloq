import { ApolloError } from "apollo-server-koa"
import { UploadModel } from "../models/upload"

const { Storage } = require("@google-cloud/storage")

const storage = new Storage(process.env.GCLOUD_PROJECT_ID) // project ID
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET) // bucket name
const bucketName: string = process.env.GCLOUD_STORAGE_BUCKET

let publicUrl: string, storageName: string, fileSize: number

const processUpload = async (
  createReadStream,
  filename,
  userID,
  resolve,
  reject
) => {
  const uniqueName: string = Date.now() + filename
  const gcsName: string = `${userID}/${encodeURIComponent(uniqueName)}`
  const file = bucket.file(gcsName)

  const opts = {
    metadata: {
      cacheControl: "private, max-age=0, no-transform",
    },
  }
  const fileStream = createReadStream()
  const gStream = file.createWriteStream(opts)
  gStream
    .on("error", err => {
      reject(new ApolloError("Error uploading file", "UPLOAD_ERROR"))
    })
    .on("finish", async err => {
      if (err) {
        throw new ApolloError("Error uploading file", "UPLOAD_ERROR")
      }

      file.makePublic().then(async () => {
        storageName = gcsName
        publicUrl = getPublicUrl(gcsName)
        await file.getMetadata().then(result => {
          fileSize = result[0].size
        })
        resolve("OK")
      })
    })

  fileStream.pipe(gStream)
}

function getPublicUrl(filename) {
  //const finalName: string = encodeURIComponent(filename);
  return `https://storage.googleapis.com/${bucketName}/${filename}`
}

const uploadResolver = {
  Query: {
    uploads: () => UploadModel.find({}),
    getUserFiles: async (root: any, args: any, context: any) => {
      //console.log(bucket)
      const [files] = await bucket.getFiles({
        prefix: `${context.user.userID}`,
      })
      console.log("Files:")
      files.forEach(async file => {
        await file.getMetadata().then(result => {
          console.log(file.name)
          console.log(result[0].size)
        })
      })
      return await UploadModel.find({ user: context.user.userID })
    },
  },
  Mutation: {
    singleUpload: async (file, documentID, userID) => {
      const { createReadStream, filename, mimetype, encoding } = await file
      if (!createReadStream || !filename || !mimetype || !encoding) {
        throw new ApolloError("Upload error, check file type.", "UPLOAD_ERROR")
      }
      await new Promise((resolve, reject) => {
        processUpload(createReadStream, filename, userID, resolve, reject)
      })
      const uploadNew = new UploadModel({
        document: documentID,
        filename,
        mimetype,
        encoding,
        publicUrl,
        user: userID,
      })
      return UploadModel.create(uploadNew)
    },
    uploadSTLFile: async (root: any, args: any, context: any) => {
      console.log(args.file)
      const { createReadStream, filename, mimetype, encoding } = await args.file
      if (!createReadStream || !filename || !mimetype || !encoding) {
        throw new ApolloError("Upload error, check file type.", "UPLOAD_ERROR")
      }
      await new Promise((resolve, reject) => {
        processUpload(
          createReadStream,
          filename,
          context.user.userID,
          resolve,
          reject
        )
      })
      const uploadNew = new UploadModel({
        document: args.documentID,
        filename,
        mimetype,
        encoding,
        publicUrl,
        user: context.user.userID,
        storageName,
        size: fileSize,
      })
      return UploadModel.create(uploadNew)
    },
    uploadImageFile: async (root: any, args: any, context: any) => {
      const { createReadStream, filename, mimetype, encoding } = await args.file
      if (!createReadStream || !filename || !mimetype || !encoding) {
        throw new ApolloError("Upload error, check file type.", "UPLOAD_ERROR")
      }
      await new Promise((resolve, reject) => {
        processUpload(
          createReadStream,
          filename,
          args.user.userID,
          resolve,
          reject
        )
      })
      const uploadNew = new UploadModel({
        document: args.documentID,
        filename,
        mimetype,
        encoding,
        publicUrl,
        user: context.user.userID,
      })
      return UploadModel.create(uploadNew)
    },
    deleteUserFile: async (root: any, args: any, context: any) => {
      if (args.filename) {
        await bucket.file(`${context.user.userID}/${args.filename}`).delete()
        return await UploadModel.deleteOne({
          publicUrl: {
            $regex: `${context.user.userID}/${args.filename}`,
            $options: "i",
          },
        })
      }
    },
  },
}

export default uploadResolver
