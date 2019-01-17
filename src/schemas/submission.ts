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
      submissionByID(id: ObjectID!): Submission
      submissions: [Submission]
      submissionsByExercise(exercise: String!): [Submission]
    }
    type Mutation {
      createSubmission(exerciseCode: String!, studentNick: String!): createOut
      updateSubmission(input: SubmissionIn): Submission
      finishSubmission(comment: String): Submission
      deleteSubmission: Submission
    }

    type Submission {
      id: ObjectID
      title: String
      exercise: ObjectID
      teacher: ObjectID
      studentNick: String
      content: String
      submissionToken: String
      finished: Boolean
      comment: String
      createdAt: Date
      updatedAt: Date
    }
    input SubmissionIn {
      title: String
      finished: Boolean
      comment: String
      studentNick: String
    }
    type createOut {
      token: String
      submissionID: ObjectID
      exerciseID: ObjectID
    }
  `,
});

addMockFunctionsToSchema({ schema: submissionSchema });
export default submissionSchema;
