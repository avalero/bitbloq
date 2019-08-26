import { graphql, GraphQLSchema } from "graphql";
import { importSchema } from "graphql-import";
import * as path from "path";
const typeDefs = importSchema(
  path.join(__dirname, "../schemas/allSchemas.graphql")
);
import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";
import { allResolvers } from "../resolvers/resolvers";
import { merge } from "lodash";
import { setupTest } from "../__helpers__/setupTest";

const schemas: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers: merge(allResolvers)
});
addMockFunctionsToSchema({
  schema: schemas,
  mocks: {
    Boolean: () => false,
    ObjectID: () => "11111111111111",
    Int: () => 1,
    Float: () => 12.34,
    String: () => "Holita vecinito",
    EmailAddress: () => "aaaa@zzz.com"
  }
});

beforeEach(async () => {
  jest.resetModules();
  await setupTest();
  require("dotenv").config();
  //  process.env = Object.assign(process.env, { CUSTOM_VAR: 'value' });
});

describe("Schema", () => {
  it("should be null when no one signed up", async () => {
    const query = `
        query {
          users {
             name
          }
        }
      `;
    const rootValue = {};
    const context = {};
    const expected = {
      data: { users: [{ name: "Hello World" }, { name: "Hello World" }] }
    };
    return await expect(
      graphql({
        schema: schemas,
        source: query,
        rootValue: rootValue,
        contextValue: context
      })
    ).resolves.toEqual(expected);
  });

  it("should register a new user", async () => {
    const mutation = `
      mutation{ 
        signUpUser(
          input:{
            email: "aaaa@zzz.com",
            password: "pass",
            name: "aaaa"
            center: "ZZ",
          }
        )
      }
    `;
    const rootValue = {};
    const context = {};
    const expected = { data: { signUpUser: "Hello World" } };
    return await expect(
      graphql({
        schema: schemas,
        source: mutation,
        rootValue: rootValue,
        contextValue: context
      })
    ).resolves.toEqual(expected);
  });
});
