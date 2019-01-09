import {
  addMockFunctionsToSchema,
  gql,
  makeExecutableSchema,
} from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';

const userSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs: gql`
    type Query {
      me: User
      users: [User]
    }
    type Mutation {
      activateAccount(token: String): String
      signUpUser(input: UserIn!): String
      login(email: String!, password: String!): String
      deleteUser(id: String!): User
      updateUser(id: String!, input: UserIn!): User
    }
    scalar Date

    type User {
      id: String
      email: String
      password: String
      name: String
      center: String
      active: Boolean
      sign_up_token: String
      auth_token: String
      notifications: Boolean
      createdAt: Date
      updatedAt: Date
    }

    input UserIn {
      email: String
      password: String
      name: String
      center: String
      active: Boolean
      sign_up_token: String
      auth_token: String
      notifications: Boolean
    }
  `,
});

addMockFunctionsToSchema({ schema: userSchema });

export default userSchema;
