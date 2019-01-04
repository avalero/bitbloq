import { DocumentModelController } from '../controllers/document.controller';
import {UserMong} from '../models/userModel';
import { DocumentModel } from '../models/documentModel';
import { ObjectId } from 'bson';

const documentResolver = {
  Mutation: {
    async createDocument(root: any, args: any, context: any) {
      if (!context.user) return [];
      if(context.user.signUp) throw new Error('Problem with token, not auth token');
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
      if(context.user.signUp) throw new Error('Problem with token, not auth token');
      //return DocumentModelController.deleteDocument(args.tittle);
      return DocumentModel.deleteOne({_id: args.id, tittle: args.tittle, type: args.type});
    },
    async updateDocument(root: any, args: any, context: any) {
      if (!context.user) return [];
      if(context.user.signUp) throw new Error('Problem with token, not auth token');
      const existDocument = await DocumentModel.findOne({_id: args.id});
      if (existDocument) {
        return DocumentModel.findOneAndUpdate({ _id: existDocument._id }, { $set: args }, {new: true});

      } else {
        return new Error('Document doesnt exist');
      }
      
    },
  },
  Query: {
    async documents(root: any, args: any, context: any) {
      if (!context.user) return [];
      if(context.user.signUp) throw new Error('Problem with token, not auth token');
      const userFinded =await UserMong.findOne({ email: context.user.email });
      //return DocumentModelController.findAllDocuments(userFinded._id);
      return DocumentModel.find({user: userFinded._id});
    },
    async documentByID(root: any, args: any, context: any) {
      if (!context.user) return [];
      if(context.user.signUp) throw new Error('Problem with token, not auth token');
      const userFinded =await UserMong.findOne({ email: context.user.email });
      //return DocumentModelController.findAllDocuments(userFinded._id);
      console.log(args.id);
      return DocumentModel.find({_id: args.id});
    },
  },
};

export default documentResolver;
