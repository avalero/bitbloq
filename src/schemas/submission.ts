// import { addMockFunctionsToSchema, gql, makeExecutableSchema } from 'apollo-server-koa';
// import { GraphQLSchema } from 'graphql';

// const submissionSchema: GraphQLSchema = makeExecutableSchema({
//   typeDefs: gql`
//   extend type Query {
//       allSubmissions: [Submission]
//     }
//     extend type Mutation {
//       createSubmission(
//         id: Int!
//         nick: String
//         content: String
//         date: String
//         comment: String
//       ): Submission
//       updateSubmission(
//         id: Int!
//         nick: String
//         content: String
//         date: String
//         comment: String
//       ): Submission
//       finishSubmission(id: Int!, comment: String): Submission
//     }
//     type Submission {
//       id: Int
//       nick: String
//       content: String
//       date: String
//       comment: String
//     }
//   `
// });

// addMockFunctionsToSchema({ schema: submissionSchema });
// export default submissionSchema;
