import DocumentMong from '../models/documentModel';

const DocumentMongController = {
  createDocument: (root: any, args: any) => {
    const DocumentMong_new = new DocumentMong({
      tittle: args.tittle,
      type: args.type,
      content: args.content,
      description: args.description,
      versions: args.version,
      exercise: args.exercise,
    });
    console.log('You saved your document');
    //TODO: singup token
    return DocumentMong_new.save();
  },
  deleteDocument: (root: any, args: any) =>
    DocumentMong.deleteOne({ email: args.tittle }),
  updateDocument: (root: any, args: any) => {
    const tempDocumentMong = { ...args };
    delete tempDocumentMong.id;
    return DocumentMong.updateOne({ _id: args.id }, { $set: tempDocumentMong });
  },
  findAllDocuments: () => DocumentMong.find({}),
};

export default DocumentMongController;
