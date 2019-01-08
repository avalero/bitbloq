import {
  addMockFunctionsToSchema,
  gql,
  makeExecutableSchema,
} from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';

const exerciseSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs: gql`
    type Query {
      exercises: [Exercise]
      exercisesByDocument(document_father: String!): [Exercise]
      exerciseByID(id: String!): Exercise
    }
    type Mutation {
      createExercise(input: ExerciseIn!): Exercise
      updateExercise(id: String!, input: ExerciseIn!): Exercise
      deleteExercise(id: String!, code: String!): Exercise

      createSubmission(student_nick: String, comment: String): Exercise
      updateSubmission(id: String): Exercise
      finishSubmission(id: String, comment: String): Exercise
      deleteSubmission(id: String): Exercise
    }

    type Exercise {
      id: String
      document_father: String
      title: String
      code: String
      versions: [String]
      submissions: [String]
      expireDate: String
    }

    input ExerciseIn {
      id: String
      document_father: String
      title: String
      code: String
      versions: [String]
      submissions: [String]
      expireDate: String
    }
  `,
});

addMockFunctionsToSchema({ schema: exerciseSchema });
export default exerciseSchema;

// output Version {
//     id: String
//     content: String
//     date: String
//   }

//   output Submission {
//     id: String
//     student_nick: String
//     content: String
//     date: String
//     finished: Boolean
//     comment: String
//   }
