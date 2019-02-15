import { ApolloError, PubSub, withFilter } from 'apollo-server-koa';
import { ObjectId } from 'bson';
import { DocumentModel } from '../models/document';
import { ExerciseModel } from '../models/exercise';
import { LogModel } from '../models/logs';
import { SubmissionModel } from '../models/submission';
import { UploadModel } from '../models/upload';
import uploadResolver from './upload';

export const pubsub = new PubSub();

const DOCUMENT_UPDATED: string = 'DOCUMENT_UPDATED';

const documentResolver = {

  Subscription: {
    documentUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([DOCUMENT_UPDATED]),
        (payload, variables, context) => {
          return context.user.userID==payload.documentUpdated.user;
        },
      ),
    },
  },

  Mutation: {
    /**
     * Create document: create a new empty document
     * It stores the new document in the database and if there is a image,
     * it uploads to Google Cloud and stores the public URL.
     * args: document information
     */
    createDocument: async (root: any, args: any, context: any) => {    
      const documentNew = new DocumentModel({
        id: ObjectId,
        user: context.user.userID,
        title: args.input.title,
        type: args.input.type,
        content: args.input.content,
        description: args.input.description,
        version: args.input.version,
        image: args.input.imageUrl,
      });
      const newDocument = await DocumentModel.create(documentNew);
      await LogModel.create({
        user: context.user.userID,
        object: documentNew._id,
        action: 'DOC_create',
        docType: documentNew.type,
      });
      if (args.input.image) {
        const imageUploaded = await uploadResolver.Mutation.singleUpload(
          args.input.image,
          newDocument._id,
        );
        const newDoc=await  DocumentModel.findOneAndUpdate(
          { _id: documentNew._id },
          { $set: { image: imageUploaded.publicUrl } },
          { new: true },
        );
        pubsub.publish(DOCUMENT_UPDATED, { documentUpdated: newDoc });
        return newDoc;
      } else {
        pubsub.publish(DOCUMENT_UPDATED, { documentUpdated: newDocument });
        return newDocument;
      }
    },

    /**
     * Delete document: delete one document of the user logged.
     * It deletes the document passed in the arguments if it belongs to the user logged.
     * This method deletes all the exercises, submissions and uploads related with the document ID.
     * args: document ID
     */
    deleteDocument: async (root: any, args: any, context: any) => {
      const existDocument = await DocumentModel.findOne({
        _id: args.id,
        user: context.user.userID,
      });
      if (existDocument) {
        await LogModel.create({
          user: context.user.userID,
          object: args.id,
          action: 'DOC_delete',
          docType: existDocument.type,
        });
        await UploadModel.deleteMany({ document: existDocument._id });
        await SubmissionModel.deleteMany({ document: existDocument._id });
        await ExerciseModel.deleteMany({ document: existDocument._id });
        return DocumentModel.deleteOne({ _id: args.id }); // delete all the document dependencies
      } else {
        throw new ApolloError(
          'You only can delete your documents',
          'DOCUMENT_NOT_FOUND',
        );
      }
    },
    /**
     * Update document: update existing document.
     * It updates the document with the new information provided.
     * args: document ID, new document information.
     */
    updateDocument: async (root: any, args: any, context: any) => {
      const existDocument = await DocumentModel.findOne({
        _id: args.id,
        user: context.user.userID,
      });

      if (existDocument) {
        await LogModel.create({
          user: context.user.userID,
          object: args.id,
          action: 'DOC_update',
          docType: existDocument.type,
        });
        if (args.input.image) {
          const imageUploaded = await uploadResolver.Mutation.singleUpload(
            args.input.image,
            existDocument._id,
          );
          const documentUpdate = {
            title: args.input.title || existDocument.title,
            type: args.input.type || existDocument.type,
            content: args.input.content || existDocument.content,
            description: args.input.description || existDocument.description,
            version: args.input.version || existDocument.version,
            image: imageUploaded.publicUrl,
          };
          const upDoc=await DocumentModel.findOneAndUpdate(
            { _id: existDocument._id },
            { $set: documentUpdate },
            { new: true },
          );
          pubsub.publish(DOCUMENT_UPDATED, { documentUpdated: upDoc });
          return upDoc;
        } else if (args.input.imageUrl) {
          const documentUpdate = {
            title: args.input.title || existDocument.title,
            type: args.input.type || existDocument.type,
            content: args.input.content || existDocument.content,
            description: args.input.description || existDocument.description,
            version: args.input.version || existDocument.version,
            image: args.input.imageUrl,
          };
          const upDoc=await DocumentModel.findOneAndUpdate(
            { _id: existDocument._id },
            { $set: documentUpdate },
            { new: true },
          );
          pubsub.publish(DOCUMENT_UPDATED, { documentUpdated: upDoc });
          return upDoc;
        } else {
          const upDoc= DocumentModel.findOneAndUpdate(
            { _id: existDocument._id },
            { $set: args.input },
            { new: true },
          );
          pubsub.publish(DOCUMENT_UPDATED, { documentUpdated: upDoc });
          return upDoc;
        }
      } else {
        return new ApolloError('Document does not exist', 'DOCUMENT_NOT_FOUND');
      }
    },
  },
  Query: {
    /**
     * Documents: returns all the documents of the user logged.
     * args: nothing.
     */
    documents: async (root: any, args: any, context: any) => {
      await LogModel.create({
        user: context.user.userID,
        action: 'DOC_documents',
      });
      return DocumentModel.find({ user: context.user.userID });
    },
    /**
     * Document: returns the information of the document ID provided in the arguments.
     * args: document ID.
     */
    document: async (root: any, args: any, context: any) => {
      const existDocument = await DocumentModel.findOne({
        _id: args.id,
      });
      if (!existDocument) {
        throw new ApolloError('Document does not exist', 'DOCUMENT_NOT_FOUND');
      }
      if (existDocument.user != context.user.userID) {
        throw new ApolloError(
          'This ID does not belong to one of your documents',
          'NOT_YOUR_DOCUMENT',
        );
      }
      await LogModel.create({
        user: context.user.userID,
        object: args.id,
        action: 'DOC_document',
        docType: existDocument.type,
      });
      return existDocument;
    },
  },

  Document: {
    exercises: async document => ExerciseModel.find({ document: document._id }),
    images: async document => UploadModel.find({ document: document._id }),
  },
};

export default documentResolver;
