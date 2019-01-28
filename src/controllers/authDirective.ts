//import {SchemaDirectiveVisitor} from 'graphql-tools';
import {AuthenticationError, SchemaDirectiveVisitor} from 'apollo-server-koa';
const jsonwebtoken = require('jsonwebtoken');


class AuthDirectiveResolvers extends SchemaDirectiveVisitor{
      visitFieldDefinition(field){
        field.resolve=async function(result, args, ctx, info){
          console.log(ctx.ctx.request);
          if(!ctx || !ctx.ctx.request.header.authorization){
            throw new AuthenticationError(
              'You must supply a JWT for authorization! Please, sign in.'
            );
          }
          const token = ctx.ctx.request.header.authorization;
          //console.log(token);
          try{
            const justToken = token.split(' ')[1];
            const userDecoded= await jsonwebtoken.verify(justToken, process.env.JWT_SECRET);
            ctx.user=userDecoded;
            return {ctx: ctx.user};
            //return userDecoded;
            //console.log(userDecoded);
            //console.log(context);
            //context.user=userDecoded;
            //return ctx;
          }catch(err){
            throw new AuthenticationError(
              'You must supply a JWT for authorization!'
            );
          }
        }
      }
    }
    
    export {AuthDirectiveResolvers};
    
        