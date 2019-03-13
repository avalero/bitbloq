import { AuthenticationError, SchemaDirectiveVisitor } from 'apollo-server-koa';
const { defaultFieldResolver } = require('graphql');

class AuthDirectiveResolvers extends SchemaDirectiveVisitor {
  public visitObject(type) {
    this.ensureFieldsWrapped(type);
    type._requiredAuthRole = this.args.requires;
  }
  //  Visitor methods for nested types like fields and arguments
  //  also receive a details object that provides information about
  //  the parent and grandparent types.
  public visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType);
    field._requiredAuthRole = this.args.requires;
  }

  private ensureFieldsWrapped(objectType) {
    //  Mark the GraphQLObjectType object to avoid re-wrapping:
    if (objectType._authFieldsWrapped) {
      return [];
    }
    objectType._authFieldsWrapped = true;

    const fields = objectType.getFields();

    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName];
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async function(...args) {
        //  Get the required Role from the field first, falling back
        //  to the objectType if no Role is required by the field:
        const requiredRole =
          field._requiredAuthRole || objectType._requiredAuthRole;

        if (!requiredRole) {
          return resolve.apply(this, args);
        }
        const context = args[2];
        if ((!context.user) || (typeof(context.user) == 'undefined')) {
          throw new AuthenticationError('You need to be logged in');
        }  else {
          let passed: boolean = false;
          for (let roleReq of requiredRole) {
            if (roleReq === 'USER' && context.user.role === 'USER') {
              if (!context.user.userID) {
                throw new AuthenticationError(
                  'You need to be logged in as User 1',
                );
              }
              passed = true;
              return resolve.apply(this, args);
            } else if (
              roleReq === 'EPHEMERAL' &&
              context.user.role === 'EPHEMERAL'
            ) {
              if (!context.user.exerciseID) {
                throw new AuthenticationError(
                  'You need to login with exercise code 1',
                );
              }
              passed = true;
              return resolve.apply(this, args);
            }
          }
          if (!passed) {
            throw new AuthenticationError('You need to be logged in. Role');
          }
        }
      };
    });
  }
}

export { AuthDirectiveResolvers };
