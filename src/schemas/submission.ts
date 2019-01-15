import {
  addMockFunctionsToSchema,
  gql,
  makeExecutableSchema,
} from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';

const submissionSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs: gql`
    scalar Date
    scalar ObjectID

    type Query {
      submissions: [Submission]
      submissionsByExercise(exercise_father: String!): [Submission]
      submissionByID(id: ObjectID!): Submission
    }
    type Mutation {
      createSubmission(exercise_code: String!, student_nick: String!): String
      updateSubmission(input: SubmissionIn): Submission
      finishSubmission(comment: String): Submission
      deleteSubmission: Submission
    }

    type Submission {
      id: ObjectID
      title: String
      exercise_father: ObjectID
      teacher: ObjectID
      student_nick: String
      content: String
      sub_token: String
      finished: Boolean
      comment: String
      createdAt: Date
      updatedAt: Date
    }
    input SubmissionIn {
      title: String
      finished: Boolean
      comment: String
      student_nick: String
    }
  `,
});

addMockFunctionsToSchema({ schema: submissionSchema });
export default submissionSchema;
