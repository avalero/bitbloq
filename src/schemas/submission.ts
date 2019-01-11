import {
  addMockFunctionsToSchema,
  gql,
  makeExecutableSchema,
} from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';

const submissionSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs: gql`
    scalar Date
    scalar JSON

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

    type Submission {
      id: String
      title: String
      exercise_code: String
      exercise_father: String
      user: String
      student_nick: String
      content: JSON
      finished: Boolean
      comment: String
      createdAt: Date
      updatedAt: Date
    }
    input SubmissionIn {
      title: String
      exercise_code: String
      student_nick: String
      comment: String
    }
  `,
});

addMockFunctionsToSchema({ schema: submissionSchema });
export default submissionSchema;
