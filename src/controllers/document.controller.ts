import { DocumentModel } from '../models/documentModel';

const DocumentModelController = {
  createDocument: (documentMong_new) => {
    return DocumentModel.create(documentMong_new);
  },
  deleteDocument: (title: any) =>{
    return DocumentModel.deleteOne({tittle: title});
  },
    
  updateDocument: (existDocument, newDocument) => {
    return DocumentModel.updateOne({ _id: existDocument._id }, { $set: newDocument });
  },
  findAllDocuments: (userID) => {
    return DocumentModel.find({user: userID});
  }
};

export { DocumentModelController };
