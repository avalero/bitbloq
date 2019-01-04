import { addMockFunctionsToSchema, gql, makeExecutableSchema } from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';

const exerciseSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs: gql`
    type Query {
      hello: String
    }
  `,
});
addMockFunctionsToSchema({ schema: exerciseSchema });

export default exerciseSchema;

//const exerciseSchema: GraphQLSchema = makeExecutableSchema({
//  typeDefs: gql`
/* const typeDefEx = `

  extend type Query {
      allExercises: [Exercise]
    }
    extend type Mutation {
      createExercise(document_father: String, expireDate: String): Exercise
      deleteExercise(code: String!): Exercise
    }
    type Exercise {
      document_father: String
      versions: [Version]
      code: String
      submissions: [Submission]
      expireDate: String
    }

    input SubmissionIn {
      id: Int
      nick: String
      content: String
      date: String
      comment: String
    }

  `; */
//});

//addMockFunctionsToSchema({ schema: exerciseSchema });
//export default exerciseSchema;
//export default typeDefEx;
