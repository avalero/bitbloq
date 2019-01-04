import { addMockFunctionsToSchema, gql, makeExecutableSchema } from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';

//const versionSchema: GraphQLSchema = makeExecutableSchema({
//  typeDefs: gql`
const typeDefVer = `
extend type Query {
            allVersions: [Version]
        }
        type Version {
          content: String,
          date:String,
          id: Int
        }
    `;
//});

/*addMockFunctionsToSchema({ schema: versionSchema });
export default versionSchema;*/

export default typeDefVer;
