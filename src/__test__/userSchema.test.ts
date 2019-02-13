import { graphql, GraphQLSchema } from 'graphql';
import { importSchema } from 'graphql-import';
import * as path from 'path';
const typeDefs = importSchema(path.join(__dirname, '../schemas/allSchemas.graphql'));
import { makeExecutableSchema } from 'graphql-tools';
import {allResolvers} from '../resolvers/resolvers';
import { merge } from 'lodash';
const schemas: GraphQLSchema = makeExecutableSchema({  typeDefs });

describe('Schema', () => {
  it('should be null when no one signed up', async () => {
    const query = `
        query {
          users {
             email
          }
        }
      `;
      const rootValue = {};
      const expected={"data": {"users": null}};
      return await expect(
          graphql(schemas, query, rootValue)
      ).resolves.toEqual(expected);
    });
  
  it('should register a new user', async () => {
    const mutation = `
    mutation{ signUpUser(input:{
            email: "pepe@bq.com",
            password: "pass",
            name: "aaaa"
            center: "ZZ",
        })
    }
    `;
    const rootValue = {};
    const expected={"data": {"signUpUser": null}};
    return await expect(
        graphql(schemas, mutation, rootValue)
    ).resolves.toEqual(expected);
  });

});
