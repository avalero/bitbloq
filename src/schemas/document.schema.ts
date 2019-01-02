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
    }
    type Mutation {
      createDocument(type: String!, tittle: String!): Document
      deleteDocument(tittle: String!, type: String!): Document
      updateDocument(
        user: String!
        tittle: String!
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
      tittle: String!
      type: String
      content: String
      description: String
    }
  `,
});

addMockFunctionsToSchema({ schema: documentSchema });

export default documentSchema;
