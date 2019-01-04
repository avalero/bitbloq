import { DocumentModelController } from '../controllers/document';
import {contextController} from '../controllers/context';
import { UserModel } from '../models/user';
import { DocumentModel } from '../models/document';
import {AuthenticationError} from 'apollo-server-koa';
import { ObjectId } from 'bson';

const documentResolver = {
  Mutation: {
    async createDocument(root: any, args: any, context: any) {
      if (!context.user) throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const userFinded = await UserModel.findOne({ email: context.user.email });
      const document_new = new DocumentModel({
        id: ObjectId,
        user: userFinded._id,
        title: args.title,
        type: args.type,
        content: args.content,
        description: args.description,
        versions: args.version,
        exercise: args.exercise,
      });
      return DocumentModelController.createDocument(document_new);
    },
    deleteDocument(root: any, args: any, context: any) {
      if (!context.user) throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      return DocumentModelController.deleteDocument(args.id);
    },
    async updateDocument(root: any, args: any, context: any) {
      if (!context.user) throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const existDocument = await DocumentModel.findOne({ _id: args.id });
      if (existDocument) {
        return DocumentModelController.updateDocument(existDocument._id, args);
      } else {
        return new Error('Document doesnt exist');
      }
    },
  },
  Query: {
    async documents(root: any, args: any, context: any) {
      if (!context.user) throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      return DocumentModelController.findAllDocuments();
    },
    async documentsByUser(root: any, args: any, context: any) {
      if (!context.user) throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const userFinded = await UserModel.findOne({ email: context.user.email });
      return DocumentModelController.findDocumentByUser(userFinded._id);
    },
    async documentByID(root: any, args: any, context: any) {
      if (!context.user) throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const userFinded = await UserModel.findOne({ email: context.user.email });
      return DocumentModelController.findDocumentByID(args.id, userFinded._id);
    },
  },
};

export default documentResolver;
