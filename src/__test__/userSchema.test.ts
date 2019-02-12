import { graphql, GraphQLSchema } from 'graphql';
import userSchema from '../schemas/user';
import { UserModel } from '../models/user';

const expectMut = describe('Schema', () => {
  //  Array of case types
  // const tester = new EasyGraphQLTester(schemaCode);

  it('should be null when no one signed up', async () => {
    const query = `
        query {
          users {
             email
          }
        }
      `;
    const rootValue = {};

    const result = await graphql(userSchema, query, rootValue);
    const { data } = result;

    // tester.test(true, query)
    expect(data.users).toBe(null);
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

    const result = await graphql(userSchema, mutation, rootValue);
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
