import { UserModel } from '../models/user';
import { DocumentModel } from '../models/document';
import { AuthenticationError } from 'apollo-server-koa';
import { ObjectId } from 'bson';

const documentResolver = {
  Mutation: {
    async createDocument(root: any, args: any, context: any) {
      if (!context.user.user_id)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      //const userFound = await UserModel.findOne({ email: context.user.email });
      const document_new = new DocumentModel({
        id: ObjectId,
        user: context.user.user_id,
        title: args.input.title,
        type: args.input.type,
        content: args.input.content,
        description: args.input.description,
        versions: args.input.version,
        exercise: args.input.exercise,
      });
      return DocumentModel.create(document_new);
      //return DocumentModelController.createDocument(document_new);
    },
    deleteDocument(root: any, args: any, context: any) {
      if (!context.user.user_id)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      return DocumentModel.deleteOne({ _id: args.id });
      //return DocumentModelController.deleteDocument(args.id);
    },
    async updateDocument(root: any, args: any, context: any) {
      if (!context.user.user_id)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      const existDocument = await DocumentModel.findOne({ _id: args.id });
      if (existDocument) {
        return DocumentModel.findOneAndUpdate(
          { _id: existDocument._id },
          { $set: args.input },
          { new: true },
        );
        // return DocumentModelController.updateDocument(
        //   existDocument._id,
        //   args.input,
        // );
      } else {
        return new Error('Document doesnt exist');
      }
    },
  },
  Query: {
    async documents(root: any, args: any, context: any) {
      if (!context.user.user_id)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      return DocumentModel.find({});
      //return DocumentModelController.findAllDocuments();
    },
    async documentsByUser(root: any, args: any, context: any) {
      if (!context.user.user_id)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      //const userFound = await UserModel.findOne({ email: context.user.email });
      return DocumentModel.find({ user: context.user.user_id });
      //return DocumentModelController.findDocumentByUser(context.user.user_id);
    },
    async documentByID(root: any, args: any, context: any) {
      if (!context.user.user_id)
        throw new AuthenticationError('You need to be logged in');
      if (context.user.signUp)
        throw new Error('Problem with token, not auth token');
      //const userFound = await UserModel.findOne({ email: context.user.email });
      return DocumentModel.findOne({ _id: args.id, user: context.user.user_id });
      //return DocumentModelController.findDocumentByID(args.id, context.user.user_id);
    },
  },
};

export default documentResolver;
