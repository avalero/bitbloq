import { DocumentMongController } from '../controllers/document.controller';

const documentResolver = {
  Mutation: {
    createDocumentGraph(root: any, args: any) {
      return DocumentMongController.createDocument(root, args);
    },
    deleteDocumentGraph(root: any, args: any) {
      return DocumentMongController.deleteDocument(root, args);
    },
    updateDocumentGraph(root: any, args: any) {
      return DocumentMongController.updateDocument(root, args);
    },
  },
  Query: {
    allDocumentGraphs() {
      return DocumentMongController.findAllDocuments();
    },
  },
};

export default documentResolver;
