import {
  ApolloError,
  AuthenticationError,
  SchemaDirectiveVisitor
} from "apollo-server-koa";
import { defaultFieldResolver } from "graphql";

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
        if (!context.user || typeof context.user === "undefined") {
          throw new AuthenticationError("You need to be logged in");
        } else {
          let passed = false;
          for (const roleReq of requiredRole) {
            console.log(context, context.user.permissions, roleReq);
            if (
              roleReq === "USER" &&
              context.user.permissions.includes("usr-")
            ) {
              passed = true;
              return resolve.apply(this, args);
            }
            if (
              roleReq === "PUBLISHER" &&
              context.user.permissions.includes("pub-")
            ) {
              passed = true;
              return resolve.apply(this, args);
            }
            if (
              roleReq === "STUDENT" &&
              context.user.permissions.includes("stu-")
            ) {
              if (!context.user.exerciseID) {
                throw new AuthenticationError(
                  "You need to login with exercise code 1"
                );
              }
              passed = true;
              return resolve.apply(this, args);
            }
            if (
              roleReq === "TEACHER" &&
              context.user.permissions.includes("tchr-")
            ) {
              passed = true;
              return resolve.apply(this, args);
            }
          }
          if (!passed) {
            throw new ApolloError(
              "You need to be logged in. Role",
              "NOT_YOUR_DOCUMENT"
            );
          }
        }
      };
    });
    return;
  }
}

export { AuthDirectiveResolvers };
