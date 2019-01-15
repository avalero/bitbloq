import {
  addMockFunctionsToSchema,
  gql,
  makeExecutableSchema,
} from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';

const documentSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs: gql`
    scalar Date
    scalar ObjectID

    type Query {
      documents: [Document]
      documentsByUser: [Document]
      documentByID(id: ObjectID!): Document
    }
    type Mutation {
      createDocument(input: DocumentIn!): Document
      deleteDocument(id: ObjectID!): Document
      updateDocument(id: ObjectID!, input: DocumentIn): Document
    }

    type Document {
      id: ObjectID
      user: ObjectID
      title: String!
      type: String
      content: String
      description: String
      createdAt: Date
      updatedAt: Date
    }

    input DocumentIn {
      id: ObjectID
      user: ObjectID
      title: String!
      type: String
      content: String
      description: String
    }
  `,
});

addMockFunctionsToSchema({ schema: documentSchema });

export default documentSchema;
