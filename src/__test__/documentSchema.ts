import { graphql, GraphQLSchema } from 'graphql';
import { importSchema } from 'graphql-import';
import * as path from 'path';
import {allResolvers} from '../resolvers/resolvers';
import { merge } from 'lodash';
const typeDefs = importSchema(path.join(__dirname, '../schemas/allSchemas.graphql'));
import { makeExecutableSchema } from 'graphql-tools';
const schemas: GraphQLSchema = makeExecutableSchema({  typeDefs });

describe('Schema', () => {

  it('should be null when there are not documents', async () => {
    const query = `
        query {
          documents {
             title
          }
        }
      `;
    const rootValue = {};
    const context={
            "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFsZGEubWFydGluQGJxLmNvbSIsInVzZXJJRCI6IjVjNjNlNjM3MTYwMjM3NzUyYzRlZDc5YiIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNTUwMDUwODg2LCJleHAiOjE1NTAwNjUyODZ9.NBJ77TT3s6m4B6aqVEYI-ULp56zb8CQDGwzf8nRzXN0"
        
    }
    const expected={"data": {"documents": null}};
    return await expect(
        graphql(schemas, query, rootValue, context)
    ).resolves.toEqual(expected);
  });

  it('should create a new document', async () => {
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
    const context={
        "headers": {
            "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFhYWFAenp6ei5jb20iLCJ1c2VySUQiOiI1YzUxODFmMzdkMDVmZjdmZmY4YTNjNTQiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTU0OTk2MzExMSwiZXhwIjoxNTQ5OTc3NTExfQ.3sgXdb8LieWbvTCjvnVOZf1yKdKmONuPUtRwV_NVges"
        }
    }
    const expected={
        "data": {
          "createDocument": 
            
            {"title": "Documento nuevo AAAA 44",
            "image": null}
          
        }
      };
    return await expect(
        graphql(schemas, mutation, context)
    ).resolves.toEqual(expected);
  });

});
