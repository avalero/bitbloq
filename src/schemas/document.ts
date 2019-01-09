import {
  addMockFunctionsToSchema,
  gql,
  makeExecutableSchema,
} from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';

const documentSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs: gql`
    type Query {
      documents: [Document]
      documentsByUser: [Document]
      documentByID(id: String!): Document
    }
    type Mutation {
      createDocument(input: DocumentIn!): Document
      deleteDocument(id: String!): Document
      updateDocument(id: String!, input: DocumentIn!): Document
    }

    scalar Date

    type Document {
      id: String
      user: String
      title: String!
      type: String
      content: String
      description: String
      createdAt: Date
      updatedAt: Date
    }

    input DocumentIn {
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
