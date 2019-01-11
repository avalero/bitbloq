import {
  addMockFunctionsToSchema,
  gql,
  makeExecutableSchema,
} from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';
const documentSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs: gql`
    type File {
      filename: String!
      mimetype: String!
      encoding: String!
    }
    type Query {
      uploads: [File]
    }
    type Mutation {
      singleUpload(file: Upload!): File!
    }
  `,
});

addMockFunctionsToSchema({ schema: documentSchema });

export default documentSchema;
