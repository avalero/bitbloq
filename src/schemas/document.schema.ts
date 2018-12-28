import {
  addMockFunctionsToSchema,
  gql,
  makeExecutableSchema,
} from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';

const documentGraphSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs: gql`
    type Query {
      allDocumentGraphs: [DocumentGraph]
    }
    type Mutation {
      createDocumentGraph(type: String!, tittle: String!): DocumentGraph
      deleteDocumentGraph(tittle: String!): DocumentGraph
      updateDocumentGraph(
        user: String!
        tittle: String!
        type: String
        content: String
        description: String
      ): DocumentGraph
      createExercise(document_father: String, expireDate: String): DocumentGraph
      deleteExercise(code: String!): DocumentGraph
    }
    type DocumentGraph {
      user: String
      tittle: String!
      type: String
      content: String
      description: String
    }
  `,
});

addMockFunctionsToSchema({ schema: documentGraphSchema });

export default documentGraphSchema;
