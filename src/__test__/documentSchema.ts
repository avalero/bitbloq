import { graphql, GraphQLSchema, GraphQLInputObjectType } from "graphql";
import { importSchema } from "graphql-import";
import * as path from "path";
import { allResolvers } from "../resolvers/resolvers";
import { merge } from "lodash";
const typeDefs = importSchema(
  path.join(__dirname, "../schemas/allSchemas.graphql")
);
import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";

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
  //process.env = Object.assign(process.env, { CUSTOM_VAR: 'value' });
});

describe("Schema", () => {
  it("should be null when there are not documents", async () => {
    const query = `
        query {
          documents {
             title
          }
        }
      `;
    const rootValue = {};
    const context = {
      user: {
        email: "alda.martin@bq.com",
        userID: "5c63e637160237752c4ed79b",
        role: "USER"
      }
    };
    const expected = {
      data: { documents: [{ title: "Hello World" }, { title: "Hello World" }] }
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

  it("should create a new document", async () => {
    const mutation = `
        mutation{
            createDocument(input:{
                title: "Documento nuevo AAAA 44", type: "robotica",
                content: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", version: "111"
            }){
                title
                image
            }
        }
    `;
    const rootValue = {};
    const context = {
      user: {
        email: "alda.martin@bq.com",
        userID: "5c63e637160237752c4ed79b",
        role: "USER"
      }
    };
    const expected = {
      data: {
        createDocument: { title: "Hello World", image: "Hello World" }
      }
    };
    return await expect(
      graphql({
        schema: schemas,
        source: mutation,
        rootValue: rootValue,
        contextValue: { context }
      })
    ).resolves.toEqual(expected);
  });

  it("should be one when there are document", async () => {
    const query = `
        query {
          documents {
             title
          }
        }
      `;
    const rootValue = {};
    const context = {
      user: {
        email: "alda.martin@bq.com",
        userID: "5c63e637160237752c4ed79b",
        role: "USER"
      }
    };
    const expected = {
      data: {
        documents: [
          {
            title: "Hello World"
          },
          {
            title: "Hello World"
          }
        ]
      }
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
});
