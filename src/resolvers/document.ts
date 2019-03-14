import { ApolloError, AuthenticationError, withFilter } from 'apollo-server-koa';
import { DocumentModel } from '../models/document';
import { ExerciseModel } from '../models/exercise';
import { FolderModel } from '../models/folder';
import { SubmissionModel } from '../models/submission';
import { UploadModel } from '../models/upload';
import { UserModel } from '../models/user';
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
        if (!(await FolderModel.findOne({_id: args.input.folder}))){
          throw new ApolloError(
            'Folder does not exist',
            'FOLDER_NOT_FOUND',
          );
        }
      }
      const documentNew = new DocumentModel({
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
      const newDocument = await DocumentModel.create(documentNew);
      await FolderModel.updateOne(
        { _id: documentNew.folder },
        { $push: { documentsID: newDocument._id } },
        { new: true },
      );
      if (args.input.image) {
        const imageUploaded = await uploadResolver.Mutation.singleUpload(
          args.input.image,
          newDocument._id,
        );
        const newDoc = await DocumentModel.findOneAndUpdate(
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
     * Update document: update existing document.
     * It updates the document with the new information provided.
     * args: document ID, new document information.
     */
    updateDocument: async (root: any, args: any, context: any) => {
      const existDocument = await DocumentModel.findOne({
        _id: args.id,
        user: context.user.userID,
      });
      if (args.input.folder) {
        if (!(await FolderModel.findOne({_id: args.input.folder}))){
          throw new ApolloError(
            'Folder does not exist',
            'FOLDER_NOT_FOUND',
          );
        }
      }
      if (existDocument) {
        if (args.input.folder && args.input.folder != existDocument.folder) {
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
          const imageUploaded = await uploadResolver.Mutation.singleUpload(
            args.input.image,
            existDocument._id,
          );
          image = imageUploaded.publicUrl;
        } else if (args.input.imageUrl) {
          image = args.input.imageUrl;
        }  
        const updatedDoc = await DocumentModel.findOneAndUpdate(
          { _id: existDocument._id },
          { $set: {
              title: args.input.title || existDocument.title,
              type: args.input.type || existDocument.type,
              folder: args.input.folder || existDocument.folder,
              content: args.input.content || existDocument.content,
              cache: args.input.cache || existDocument.cache,
              description: args.input.description || existDocument.description,
              version: args.input.version || existDocument.version,
              image: image || existDocument.image,
            }
          },
          { new: true },
        );
        pubsub.publish(DOCUMENT_UPDATED, { documentUpdated: updatedDoc });
        return updatedDoc;
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
      return existDocument;
    },
  },

  Document: {
    exercises: async document => ExerciseModel.find({ document: document._id }),
    images: async document => UploadModel.find({ document: document._id }),
  },
};

export default documentResolver;
