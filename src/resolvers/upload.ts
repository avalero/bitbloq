import { UploadModel } from '../models/upload';
const { Storage } = require('@google-cloud/storage');
const storage = new Storage(process.env.GCLOUD_PROJECT_ID); //proyect ID
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET); //bucket name

const processUpload = async upload => {
  const { createReadStream, filename, mimetype } = await upload;

  const gcsname = Date.now() + filename;
  const file = bucket.file(gcsname);
  //await storage.bucket(process.env.CLOUDSTORAGEBUCKET).upload(filename, opts);
  //(se comentarían todos los stream);
  var opts = {
    metadata: {
      cacheControl: 'private, max-age=0, no-transform',
    },
  };
  const stream = upload.createWriteStream(opts);

  stream.on('error', function(err) {
    throw new Error('Error uploading image');
  });

  stream.on('finish', () => {
    file.makePublic().then(() => {
      return 'Finished upload';
    });
  });

  stream.end(upload.buffer);

  console.log(`${filename} uploaded.`);
};

const uploadResolver = {
  Query: {
    uploads: () => UploadModel.find({}),
  },
  Mutation: {
    async singleUpload(parent, { file }) {
      const { stream, filename, mimetype, encoding } = await file;

      await processUpload(file);

      UploadModel.create(file);

      return { filename, mimetype, encoding };
    },
  },
};

export default uploadResolver;
