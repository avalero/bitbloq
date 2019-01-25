import { UploadModel } from '../models/upload';
const { Storage } = require('@google-cloud/storage');
import { ObjectID } from 'bson';

const storage = new Storage(process.env.GCLOUD_PROJECT_ID); //proyect ID
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET); //bucket name
const bucketName: String = process.env.GCLOUD_STORAGE_BUCKET;

let publicURL: String;

const processUpload = async (createReadStream, filename, resolve, reject) => {
  const gcsname = Date.now() + filename;
  const file = bucket.file(gcsname);

  var opts = {
    metadata: {
      cacheControl: 'private, max-age=0, no-transform',
    },
  };
  const fileStream = createReadStream();
  const gStream = file.createWriteStream(opts);

  gStream
    .on('error', err => {
      reject('KO');
      throw new Error('Error uploading image');
    })

    .on('finish', async err => {
      if (err) throw new Error('Error uploading file');
      file.makePublic().then(() => {
        publicURL = getPublicUrl(gcsname);
        resolve('OK');
      });
    });

  fileStream.pipe(gStream);
};

function getPublicUrl(filename) {
  return `https://storage.googleapis.com/${bucketName}/${filename}`;
}

const uploadResolver = {
  Query: {
    uploads: () => UploadModel.find({}),
  },
  Mutation: {
    singleUpload: async (file, documentID) => {
      console.log(file);
      const { createReadStream, filename, mimetype, encoding } = await file;

      await new Promise((resolve, reject) =>
        processUpload(createReadStream, filename, resolve, reject),
      );

      const uploadNew = new UploadModel({
        id: ObjectID,
        document: documentID,
        filename: filename,
        mimetype: mimetype,
        encoding: encoding,
        publicURL: publicURL,
      });
      console.log(uploadNew);
      return UploadModel.create(uploadNew);
    },
  },
};

export default uploadResolver;
