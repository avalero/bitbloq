import { DocumentModel } from '../models/document';

const DocumentModelController = {
  createDocument: newDocument => {
    return DocumentModel.create(newDocument);
  },
  deleteDocument: documentID => {
    return DocumentModel.deleteOne({ _id: documentID });
  },
  deleteManyDocs: (userID: String) => {
    return DocumentModel.deleteMany({ user: userID }, err => {
      if (err) throw new Error('Error borrando los documentos');
    });
  },
  updateDocument: (existDocumentID, newDocument) => {
    return DocumentModel.findOneAndUpdate(
      { _id: existDocumentID },
      { $set: newDocument },
      { new: true },
    );
  },
  findAllDocuments: () => {
    return DocumentModel.find({});
  },
  findDocumentByUser: userID => {
    return DocumentModel.find({ user: userID });
  },
  findDocumentByID: (documentID, userID) => {
    return DocumentModel.findOne({ _id: documentID, user: userID });
  },
};

export { DocumentModelController };
