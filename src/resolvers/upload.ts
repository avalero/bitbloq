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
  const fileStream = createReadStream();
  const gStream = file.createWriteStream(opts);

  gStream
    .on('error', function(err) {
        throw new Error('Error uploading image');
    })

    .on('finish', (err) => {
        if(err) throw new Error ('Error uploading file');
        console.log("ENTRA EN FINISH");
        upload.cloudStorageObject = gcsname;
        file.makePublic().then(() => {
          upload.cloudStoragePublicUrl = getPublicUrl(gcsname);
          console.log(upload.cloudStoragePublicUrl);
        });
    
    })
  
    fileStream.pipe(gStream);


    console.log(`${filename} uploaded.`);
};

function getPublicUrl (filename) {
    return `https://storage.googleapis.com/${process.env.CLOUDSTORAGEBUCKET}/${filename}`;
  }



const uploadResolver = {
  Query: {
    uploads: () => UploadModel.find({}),
  },
  Mutation: {
    async singleUpload(parent, { file }) {
      const { filename, mimetype, encoding } = await file;

      const fileRes = await processUpload(file);

      await UploadModel.create(file);

      return fileRes;
    },
  },
};

export default uploadResolver;