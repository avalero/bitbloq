import { AuthenticationError, SchemaDirectiveVisitor } from 'apollo-server-koa';
const { defaultFieldResolver } = require('graphql');

class AuthDirectiveResolvers extends SchemaDirectiveVisitor {
  visitObject(type) {
    this.ensureFieldsWrapped(type);
    type._requiredAuthRole = this.args.requires;
  }
  // Visitor methods for nested types like fields and arguments
  // also receive a details object that provides information about
  // the parent and grandparent types.
  visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType);
    field._requiredAuthRole = this.args.requires;
  }

  ensureFieldsWrapped(objectType) {
    // Mark the GraphQLObjectType object to avoid re-wrapping:
    if (objectType._authFieldsWrapped) return;
    objectType._authFieldsWrapped = true;

    const fields = objectType.getFields();

    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName];
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async function(...args) {
        // Get the required Role from the field first, falling back
        // to the objectType if no Role is required by the field:
        const requiredRole =
          field._requiredAuthRole || objectType._requiredAuthRole;

        if (!requiredRole) {
          return resolve.apply(this, args);
        }
        console.log('entra en DIRECTIVE');
        let context = args[2];
        if (!context.user)
          throw new AuthenticationError('You need to be logged in');
        else {
          const userRole: String = context.user.role;
          switch (userRole) {
            case 'USER':
              if (!context.user.userID)
                throw new AuthenticationError(
                  'You need to be logged in as User',
                );
              return resolve.apply(this, args);
            case 'EPHEMERAL':
              if (!context.user.exerciseID)
                throw new AuthenticationError(
                  'You need to login with exercise code',
                );
              return resolve.apply(this, args);
            default:
              throw new AuthenticationError('You need to be logged in. Role');
          }
        }
      };
    });
  }
}

export { AuthDirectiveResolvers };
