import { UserModel } from '../models/user';
import { DocumentModel } from '../models/document';
import { AuthenticationError } from 'apollo-server-koa';
import { ObjectId } from 'bson';
import { ExerciseModel } from '../models/exercise';
import { UploadModel } from '../models/upload';

const documentResolver = {
  Mutation: {
    createDocument: async (root: any, args: any, context: any) => {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      else if (!context.user.userID)
        throw new AuthenticationError('You need to be logged in');
      const documentNew = new DocumentModel({
        id: ObjectId,
        user: context.user.userID,
        title: args.input.title,
        type: args.input.type,
        content: args.input.content,
        description: args.input.description,
        version: args.input.version,
        exercise: args.input.exercise,
      });
      return DocumentModel.create(documentNew);
    },

    deleteDocument: async (root: any, args: any, context: any) => {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      else if (!context.user.userID)
        throw new AuthenticationError('You need to be logged in');
      return DocumentModel.deleteOne({ _id: args.id });
    },

    updateDocument: async (root: any, args: any, context: any) => {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      else if (!context.user.userID)
        throw new AuthenticationError('You need to be logged in');
      const existDocument = await DocumentModel.findOne({ _id: args.id });
      if (existDocument) {
        return DocumentModel.findOneAndUpdate(
          { _id: existDocument._id },
          { $set: args.input },
          { new: true },
        );
      } else {
        return new Error('Document does not exist');
      }
    },
  },
  Query: {
    documents: async (root: any, args: any, context: any) => {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      else if (!context.user.userID)
        throw new AuthenticationError('You need to be logged in');
      console.log(args);
      console.log(context);
      return DocumentModel.find({ user: context.user.userID });
    },
    document: async (root: any, args: any, context: any) => {
      if (!context.user)
        throw new AuthenticationError('You need to be logged in');
      else if (!context.user.userID)
        throw new AuthenticationError('You need to be logged in');
      const doc = await DocumentModel.findOne({
        _id: args.id,
      });
      if (!doc) {
        throw new Error('Document does not exist');
      }
      if (doc.user != context.user.userID) {
        throw new Error('This ID does not belong to one of your documents');
      }
      return doc;
    },
  },
  Document: {
    exercises: async document => ExerciseModel.find({ document: document._id }),
    uploads: async document => UploadModel.find(),
  },
};

export default documentResolver;
