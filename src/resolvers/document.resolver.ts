import { DocumentModelController } from '../controllers/document.controller';
import {UserMong} from '../models/userModel';
import { DocumentModel } from '../models/documentModel';
import { ObjectId } from 'bson';

const documentResolver = {
  Mutation: {
    async createDocument(root: any, args: any, context: any) {
      console.log(context);
      if (!context.user) return [];
      const userFinded =await UserMong.findOne({ email: context.user.email });
      const documentMong_new = new DocumentModel({
        id: ObjectId,
        user: userFinded._id,
        tittle: args.tittle,
        type: args.type,
        content: args.content,
        description: args.description,
        versions: args.version,
        exercise: args.exercise,
      });
      //return DocumentModelController.createDocument(documentMong_new);
      return DocumentModel.create(documentMong_new);
    },
    deleteDocument(root: any, args: any, context: any) {
      if (!context.user) return [];
      //return DocumentModelController.deleteDocument(args.tittle);
      return DocumentModel.deleteOne({tittle: args.tittle, type: args.type});
    },
    async updateDocument(root: any, args: any, context: any) {
      if (!context.user) return [];
      const existDocument = await DocumentModel.findOne(args.tittle);
      if (existDocument) {
        //delete tempUser.id;
        //return DocumentModelController.updateDocument(existDocument, {args});
        return DocumentModel.updateOne({ _id: existDocument._id }, { $set: args });
      } else {
        return new Error('Document doesnt exist');
      }
      
    },
  },
  Query: {
    async documents(root: any, args: any, context: any) {
      if (!context.user) return [];
      const userFinded =await UserMong.findOne({ email: context.user.email });
      //return DocumentModelController.findAllDocuments(userFinded._id);
      return DocumentModel.find({user: userFinded._id});
    },
  },
};

export default documentResolver;
