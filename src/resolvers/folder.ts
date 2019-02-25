import { ApolloError, PubSub } from 'apollo-server-koa';
import { ObjectId } from 'bson';
import { DocumentModel } from '../models/document';
import { FolderModel } from '../models/folder';
import { LogModel } from '../models/logs';
import documentResolver from './document';

const folderResolver = {
  Mutation: {
    /**
     * Create folder: create a new empty folder.
     * args: folder information
     */
    createFolder: async (root: any, args: any, context: any) => {
      const folderNew = new FolderModel({
        id: ObjectId,
        name: args.input.name,
        user: context.user.userID,
        parent: args.input.parent,
        root: args.input.root
      });
      const newFolder = await FolderModel.create(folderNew);
      await LogModel.create({
        user: context.user.userID,
        object: newFolder._id,
        action: 'FOL_create',
        docType: 'Folder',
      });
      return newFolder;
    },

    /**
     * Delete folder: delete one folder of the user logged.
     * It deletes the folder passed in the arguments if it belongs to the user logged.
     * The method deletes all the documents inside de document
     * args: folder ID
     */
    deleteFolder: async (root: any, args: any, context: any) => {
      const existFolder = await FolderModel.findOne({
        _id: args.id,
        user: context.user.userID,
      });
      if (existFolder) {
        await LogModel.create({
          user: context.user.userID,
          object: existFolder._id,
          action: 'FOL_delete',
          docType: 'Folder',
        });
        if(existFolder.documentsID.length >0){
            for(let document in existFolder.documentsID){
                await documentResolver.Mutation.deleteDocument('',{id: document}, context);
            }
        }
        return await FolderModel.deleteOne({ _id: args.id });
      } else {
        return new ApolloError('Folder does not exist', 'FOLDER_NOT_FOUND');
      }
    },

    /**
     * Update folder: update existing folder.
     * It updates the folder with the new information provided.
     * args: folder ID, new folder information.
     */
    updateFolder: async (root: any, args: any, context: any) => {
      const existFolder = await FolderModel.findOne({
        _id: args.id,
        user: context.user.userID,
      });
      if (existFolder) {
        await LogModel.create({
          user: context.user.userID,
          object: existFolder._id,
          action: 'FOL_update',
          docType: 'Folder',
        });
        return FolderModel.findOneAndUpdate(
          { _id: existFolder._id },
          { $set: args.input },
          { new: true },
        );
      } else {
        return new ApolloError('Folder does not exist', 'FOLDER_NOT_FOUND');
      }
    },
  },

  Query: {
    /**
     * Folders: returns all the folders of the user logged.
     * args: nothing.
     */
    folders: async (root: any, args: any, context: any) => {
      await LogModel.create({
        user: context.user.userID,
        action: 'FOL_folders',
      });
      return FolderModel.find({ user: context.user.userID });
    },

    /**
     * Folder: returns the information of the folder ID provided in the arguments.
     * args: folder ID.
     */
    folder: async (root: any, args: any, context: any) => {
        const existFolder = await FolderModel.findOne({
          _id: args.id,
          user: context.user.userID,
        });
        if (!existFolder) {
          throw new ApolloError(
            'Folder does not exist',
            'FOLDER_NOT_FOUND',
          );
        }
        await LogModel.create({
          user: context.user.userID,
          object: existFolder._id,
          action: 'FOL_folder',
          docType: 'Folder',
        });
        return existFolder;
      
    },

    /**
     * Root: returns the root folder of the user logged.
     * args: nothing.
     */
    rootFolder: async (root: any, args: any, context: any) => {
      const rootFolder = await FolderModel.find({
        user: context.user.userID,
      });
      await LogModel.create({
        user: context.user.userID,
        action: 'FOL_rootFolder',
        docType: 'Folder'
      });
      return rootFolder;
    },
  },

  Folder: {
    documents: async folder =>
      DocumentModel.find({ folder: folder }),
  },
};

export default folderResolver;
