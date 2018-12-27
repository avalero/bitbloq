import { makeExecutableSchema } from 'graphql-tools';
import { graphql, GraphQLSchema } from 'graphql';
import typeDefs from '../schemas/user.schema';

const expectMut = describe('Schema', () => {
  // Array of case types
  //const tester = new EasyGraphQLTester(schemaCode);
  const schema: GraphQLSchema = makeExecutableSchema({ typeDefs });

  it('shold be null when no one signed up', async () => {
    const query = `
        query {
          allUsers {
             email
          }
        }
      `;
    const rootValue = {};

    const result = await graphql(schema, query, rootValue);
    const { data } = result;

    //tester.test(true, query)
    expect(data.allUsers).toBe(null);
  });

  it('should register a new user', async () => {
    const mutation = `
    mutation{
        singUpUser(email: "pepe@bbb.com", password: "pass", name: "Pepito", center: "GGM"){
            email
            password
            name
            center
        }
    }
    `;
    const rootValue = {};

    const result = await graphql(schema, mutation, rootValue);
    const { data } = result;
    console.log(data);
    /*tester.test(true, mutation, [{
        email: "pepe@bbb.com",
        password: "pass",
        name: "Pepito",
        center: "GGM"
    }]);*/
    expect(data.singUpUser.user.email).toBe('pepe@bbb.com');
  });
});
