import {
  addMockFunctionsToSchema,
  gql,
  makeExecutableSchema,
} from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';

//import {typeDefUser as User} from './user.schema';

//const documentGraphSchema: GraphQLSchema = makeExecutableSchema({
//typeDefs: gql`
const typeDefDoc = `
  extend type Query {
      allDocumentGraphs: [DocumentGraph]
    }
    extend type Mutation {
      createDocumentGraph(type: String!, tittle: String!): DocumentGraph
      deleteDocumentGraph(tittle: String!): DocumentGraph
      updateDocumentGraph(
        user: String!
        tittle: String!
        type: String
        content: String
        description: String
        versions: [VersionIn]
        exercises: [ExerciseIn]
      ): DocumentGraph
      createExercise(document_father: String, expireDate: String): DocumentGraph
      deleteExercise(code: String!): DocumentGraph
    }
    type DocumentGraph {
      user: User
      tittle: String!
      type: String
      content: String
      description: String
      versions: [Version]
      exercises: [Exercise]
    }

    input VersionIn {
      content: String,
      date:String,
      id: Int
    }

    input ExerciseIn {
      document_father: String
      versions: [Version]
      code: String
      submissions: [String]
      expireDate: String
    }
  `;
//});

/*const documentGraphSchema: GraphQLSchema=makeExecutableSchema({
  typeDefs: [typeDefDoc, User]});

addMockFunctionsToSchema({ schema: documentGraphSchema });

export default documentGraphSchema;
*/

export default typeDefDoc;
