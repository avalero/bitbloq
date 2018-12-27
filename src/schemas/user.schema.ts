import {
  addMockFunctionsToSchema,
  gql,
  makeExecutableSchema,
} from 'apollo-server';
import { GraphQLSchema } from 'graphql';

const userSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs: gql`
    type Query {
      allUsers: [User]
    }
    type Mutation {
      signUpUser(
        input: UserIn!
      ): User
      activateAccount(sign_up_token: Int!): User
      login(email: String!, password: String!): User
      deleteUser(email: String!): User
      updateUser(
       input: UserIn!
      ): User
    }
    type User {
      email: String
      password: String
      name: String
      center: String
      active: Boolean
      sign_up_token: Int
      auth_token: Int
      notifications: Boolean
    }

    input UserIn{
      email: String
      password: String
      name: String
      center: String
      active: Boolean
      sign_up_token: Int
      auth_token: Int
      notifications: Boolean
    }
  `
});


addMockFunctionsToSchema({ schema: userSchema });

export default userSchema;

