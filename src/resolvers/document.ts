import {
  ApolloError,
  AuthenticationError,
  withFilter,
} from 'apollo-server-koa';
import { DocumentModel, IDocument } from '../models/document';
import { ExerciseModel } from '../models/exercise';
import { FolderModel } from '../models/folder';
import { SubmissionModel } from '../models/submission';
import { IUpload, UploadModel } from '../models/upload';
import { UserModel } from '../models/user';

import { logger, loggerController } from '../controllers/logs';
import { pubsub } from '../server';
import uploadResolver from './upload';

const DOCUMENT_UPDATED: string = 'DOCUMENT_UPDATED';

const documentResolver = {
  Subscription: {
    documentUpdated: {
      subscribe: withFilter(
        // Filtra para devolver solo los documentos del usuario
        () => pubsub.asyncIterator([DOCUMENT_UPDATED]),
        (payload, variables, context) => {
          return context.user.userID === payload.documentUpdated.user;
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
      if (args.input.folder) {
        if (!(await FolderModel.findOne({ _id: args.input.folder }))) {
          throw new ApolloError('Folder does not exist', 'FOLDER_NOT_FOUND');
        }
      }
      const documentNew: IDocument = new DocumentModel({
        user: context.user.userID,
        title: args.input.title,
        type: args.input.type,
        folder:
          args.input.folder ||
          (await UserModel.findOne({ _id: context.user.userID })).rootFolder,
        content: args.input.content,
        cache: args.input.cache,
        description: args.input.description,
        version: args.input.version,
        image: args.input.imageUrl,
      });
      const newDocument: IDocument = await DocumentModel.create(documentNew);
      await FolderModel.updateOne(
        { _id: documentNew.folder },
        { $push: { documentsID: newDocument._id } },
        { new: true },
      );
      loggerController.storeInfoLog(
        'API',
        'document',
        'create',
        args.input.type,
        documentNew.user,
        '',
      );
      if (args.input.image) {
        const imageUploaded: IUpload = await uploadResolver.Mutation.singleUpload(
          args.input.image,
          newDocument._id,
        );
        const newDoc: IDocument = await DocumentModel.findOneAndUpdate(
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
      const existDocument: IDocument = await DocumentModel.findOne({
        _id: args.id,
        user: context.user.userID,
      });
      if (existDocument) {
        loggerController.storeInfoLog(
          'API',
          'document',
          'delete',
          existDocument.type,
          existDocument.user,
          '',
        );
        await FolderModel.updateOne(
          { _id: existDocument.folder }, // modifico los documentsID de la carpeta
          { $pull: { documentsID: existDocument._id } },
        );
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
     *  Update document Content: update content of existing document.
     *  It updates document content with the new information provided.
     *  args: id, content and cache
     */
    updateDocumentContent: async (root: any, args: any, context: any) => {
      const existDocument: IDocument = await DocumentModel.findOne({
        _id: args.id,
        user: context.user.userID,
      });
      if (existDocument) {
        const updatedDoc: IDocument = await DocumentModel.findOneAndUpdate(
          { _id: existDocument._id },
          {
            $set: {
              content: args.content || existDocument.content,
              cache: args.cache || existDocument.cache,
            },
          },
          { new: true },
        );
        pubsub.publish(DOCUMENT_UPDATED, { documentUpdated: updatedDoc });
        return updatedDoc;
      } else {
        return new ApolloError('Document does not exist', 'DOCUMENT_NOT_FOUND');
      }
    },

    /**
     * Update document: update information of existing document.
     * It updates the document with the new information provided.
     * args: document ID, new document information.
     */
    updateDocument: async (root: any, args: any, context: any) => {
      const existDocument: IDocument = await DocumentModel.findOne({
        _id: args.id,
        user: context.user.userID,
      });
      if (args.input.folder) {
        if (!(await FolderModel.findOne({ _id: args.input.folder }))) {
          throw new ApolloError('Folder does not exist', 'FOLDER_NOT_FOUND');
        }
      }
      if (existDocument) {
        if (
          args.input.folder &&
          args.input.folder !== String(existDocument.folder)
        ) {
          await FolderModel.updateOne(
            { _id: args.input.folder }, // modifico los documentsID de la carpeta
            { $push: { documentsID: existDocument._id } },
          );
          await FolderModel.updateOne(
            { _id: existDocument.folder }, // modifico los documentsID de la carpeta donde estaba el documento
            { $pull: { documentsID: existDocument._id } },
          );
        }
        let image: string;
        if (args.input.image) {
          const imageUploaded: IUpload = await uploadResolver.Mutation.singleUpload(
            args.input.image,
            existDocument._id,
          );
          image = imageUploaded.publicUrl;
        } else if (args.input.imageUrl) {
          image = args.input.imageUrl;
        }
        if (args.input.content || args.input.cache) {
          console.log(
            'You should use Update document Content Mutation, USE_UPDATECONTENT_MUTATION',
          );
        }
        const updatedDoc: IDocument = await DocumentModel.findOneAndUpdate(
          { _id: existDocument._id },
          {
            $set: {
              title: args.input.title || existDocument.title,
              type: args.input.type || existDocument.type,
              folder: args.input.folder || existDocument.folder,
              content: args.input.content || existDocument.content,
              cache: args.input.cache || existDocument.cache,
              description: args.input.description || existDocument.description,
              version: args.input.version || existDocument.version,
              image: image || existDocument.image,
            },
          },
          { new: true },
        );
        loggerController.storeInfoLog(
          'API',
          'document',
          'update',
          existDocument.type,
          existDocument.user,
          '',
        );
        pubsub.publish(DOCUMENT_UPDATED, { documentUpdated: updatedDoc });
        return updatedDoc;
      } else {
        return new ApolloError('Document does not exist', 'DOCUMENT_NOT_FOUND');
      }
    },

    /**
     * publish Document: only an admin user can publish a document.
     * A public document is an example file. Once the document is public, every user can see it.
     * args: document id, and public value.
     */
    publishDocument: async (root: any, args: any, context: any) => {
      const docFound: IDocument = await DocumentModel.findOne({ _id: args.id });
      if (!docFound) {
        return new ApolloError('Document does not exist', 'DOCUMENT_NOT_FOUND');
      }
      return await DocumentModel.findOneAndUpdate(
        { _id: docFound._id },
        { $set: { public: args.public } },
        { new: true },
      );
    },

    /**
     * open Document copy: when a user wants to edit an example document has to make a copy in his account.
     * The example document has to be public.
     * args: document ID
     */
    openDocumentCopy: async (root: any, args: any, context: any) => {
      const docFound: IDocument = await DocumentModel.findOne({
        _id: args.id,
        public: true,
      });
      if (!docFound) {
        return new ApolloError('Document does not exist', 'DOCUMENT_NOT_FOUND');
      }
      const docCopy: IDocument = new DocumentModel({
        user: context.user.userID,
        title: docFound.title,
        type: docFound.type,
        folder: (await UserModel.findOne({ _id: context.user.userID }))
          .rootFolder,
        content: docFound.content,
        cache: docFound.cache,
        description: docFound.description,
        version: docFound.version,
        image: docFound.image,
      });
      const newDoc: IDocument = await DocumentModel.create(docCopy);
      await FolderModel.updateOne(
        { _id: newDoc.folder },
        { $push: { documentsID: newDoc._id } },
        { new: true },
      );
      pubsub.publish(DOCUMENT_UPDATED, { documentUpdated: newDoc });
      return newDoc;
    },
  },
  Query: {
    /**
     * Documents: returns all the documents of the user logged.
     * args: nothing.
     */
    documents: async (root: any, args: any, context: any) => {
      return DocumentModel.find({ user: context.user.userID });
    },
    /**
     * Document: returns the information of the document ID provided in the arguments.
     * args: document ID.
     */
    document: async (root: any, args: any, context: any) => {
      const existDocument: IDocument = await DocumentModel.findOne({
        _id: args.id,
      });
      if (!existDocument) {
        throw new ApolloError('Document does not exist', 'DOCUMENT_NOT_FOUND');
      }
      if (String(existDocument.user) !== context.user.userID) {
        throw new ApolloError(
          'This ID does not belong to one of your documents',
          'NOT_YOUR_DOCUMENT',
        );
      }
      return existDocument;
    },

    /**
     * open public document: returns the information of the public document ID provided in the arguments.
     * args: public document ID.
     */
    openPublicDocument: async (root: any, args: any, context: any) => {
      const existDocument: IDocument = await DocumentModel.findOne({
        _id: args.id,
        public: true,
      });
      if (!existDocument) {
        throw new ApolloError('Document does not exist', 'DOCUMENT_NOT_FOUND');
      }
      return existDocument;
    },
  },

  Document: {
    exercises: async (document: IDocument) =>
      ExerciseModel.find({ document: document._id }),
    images: async (document: IDocument) =>
      UploadModel.find({ document: document._id }),
  },
};

export default documentResolver;
