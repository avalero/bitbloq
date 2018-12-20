import documentMongController from '../controllers/document.controller';

const documentResolver = {
  Mutation: {
    createDocumentGraph(root: any, args: any) {
      return documentMongController.createDocument(root, args);
    },
    deleteDocumentGraph(root: any, args: any) {
      return documentMongController.deleteDocument(root, args);
    },
    updateDocumentGraph(root: any, args: any) {
      return documentMongController.updateDocument(root, args);
    },
  },
  Query: {
    allDocumentGraphs() {
      return documentMongController.findAllDocuments();
    },
  },
};

export default documentResolver;
