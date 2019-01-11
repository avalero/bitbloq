import { DocumentModelController } from '../controllers/document';
import { AuthenticationError } from 'apollo-server-koa';
import { DocumentModel } from '../models/document';

const uploadResolver = {
  Mutation: {
    async singleUpload(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');

      const documentFound = await DocumentModel.findOne({
        _id: args.id,
        user: context.user.id,
      });
      if (!documentFound) throw new Error('Document doesnt exist');
      const { stream, filename, mimetype, encoding } = await args.file;

      const gcsname = Date.now() + filename;

      // 1. Validate file metadata.

      // 2. Stream file contents into cloud storage:
      // https://nodejs.org/api/stream.html

      // 3. Record the file upload in your DB.
      // const id = await recordFile( … )
      DocumentModelController.updateDocument(documentFound._id, {
        image: args.file,
      });

      return { filename, mimetype, encoding };
    },
  },
  Query: {
    async uploads(root: any, args: any, context: any) {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const documentFound = await DocumentModel.findOne({
        _id: args.document_father,
        user: context.user.id,
      });
      DocumentModelController.getAllUploads(documentFound._id);
    },
  },
};

export default uploadResolver;
