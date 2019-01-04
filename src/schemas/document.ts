import { addMockFunctionsToSchema, gql, makeExecutableSchema } from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';

const documentSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs: gql`
    type Query {
      documents: [Document]
      documentsByUser: [Document]
      documentByID(id: String!): [Document]
    }
    type Mutation {
      createDocument(type: String!, title: String!): Document
      deleteDocument(id: String): Document
      updateDocument(
        id: String
        user: String
        title: String!
        type: String
        content: String
        description: String
      ): Document
      createExercise(document_father: String, expireDate: String): Document
      deleteExercise(code: String!): Document
    }
    type Document {
      id: String
      user: String
      title: String!
      type: String
      content: String
      description: String
    }
  `,
});

addMockFunctionsToSchema({ schema: documentSchema });

export default documentSchema;
