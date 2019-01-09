import {
  addMockFunctionsToSchema,
  gql,
  makeExecutableSchema,
} from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';

const submissionSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs: gql`
    type Query {
      submissions: [Submission]
      submissionsByExercise(exercise_father: String!): [Submission]
      submissionByID(id: String!): Submission
    }
    type Mutation {
      createSubmission(input: SubmissionIn!): Submission
      updateSubmission(id: String): Submission
      finishSubmission(id: String, comment: String): Submission
      deleteSubmission(id: String): Submission
    }
    scalar Date
    type Submission {
      id: String
      title: String
      exercise_father: String
      user: String
      student_nick: String
      content: String
      finished: Boolean
      comment: String
      createdAt: Date
      updatedAt: Date
    }
    input SubmissionIn {
      title: String
      exercise_father: String
      student_nick: String
      comment: String
    }
  `,
});

addMockFunctionsToSchema({ schema: submissionSchema });
export default submissionSchema;
