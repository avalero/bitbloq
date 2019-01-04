import { userController } from '../controllers/user.controller';
import { UserMong, ContactSchema } from '../models/userModel';
import { AuthenticationError } from 'apollo-server-koa';
import { tokenize } from 'protobufjs';
const jsonwebtoken = require('jsonwebtoken');

const userResolver = {
  Mutation: {
    //public methods:
    async signUpUser(root: any, args: any) {
      const contactFinded = await UserMong.findOne({ email: args.input.email });
      if(contactFinded){
        throw new Error('This user already exists');
      }
      const token = jsonwebtoken.sign(
        { email: args.input.email, password: args.input.password, signUp: true },
        '\x7f\x981\xcbRc67\x90I\x13\xe5*\xcc\xd2\x0b\\\x9c\x9e\xfd\x99EV\x10',
        { expiresIn: '1h' },
      );
      console.log(args.input);
      const user_new = new UserMong({
        email: args.input.email,
        password: args.input.password,
        name: args.input.name,
        center: args.input.center,
        active: false,
        signUpToken: token,
        authToken: "patata",
        notifications: args.input.notifications,
      });
      userController.signUpUser(user_new);
      return token;
    },
    async login(root: any, { email, password }) {
      const contactFinded = await UserMong.findOne({ email });
      if (!contactFinded) {
        throw new Error('Contact not found');
      }
      if (contactFinded.password != password) {
        throw new Error('pass error');
      }
      const token: String = jsonwebtoken.sign(
        { email: contactFinded.email, password: contactFinded.password, signUp: false },
        '\x7f\x981\xcbRc67\x90I\x13\xe5*\xcc\xd2\x0b\\\x9c\x9e\xfd\x99EV\x10',
      );
      userController.updateUser(contactFinded._id, {authToken: token});
      return token;
    },

    //private methods:

    async deleteUser(root: any, args:any, context: any) {
      if (!context.user) return [];
      if(context.user.signUp) throw new Error('Problem with token, not auth token');
      const contactFinded = await UserMong.findOne({ email: context.user.email });
      return userController.deleteUser(contactFinded._id);
    },
    async updateUser(root: any, args:any, context: any, input:any) {
      if (!context.user) return [];
      if(context.user.signUp) throw new Error('Problem with token, not auth token');
      const contactFinded = await UserMong.findOne({ email: context.user.email });
      if (contactFinded) {
        //delete tempUser.id;
        const data= args.input;
        return userController.updateUser(contactFinded._id, data);
      } else {
        return new Error('User doesnt exist');
      }
    },
  },
  Query: {
    users(root: any, args: any, context: any) {
      if (!context.user) return [];
      if(context.user.signUp) throw new Error('Problem with token, not auth token');
      return userController.findAllUsers();
    },

    async activateAccount(root: any, args: any, context: any) {
      if(!context.user) throw new Error("Error with sign up token, try again");
      const contactFinded = await UserMong.findOne({ email: context.user.email });
      if(context.user.signUp===true){
        var token: String = jsonwebtoken.sign(
          { email: contactFinded.email, password: contactFinded.password },
          '\x7f\x981\xcbRc67\x90I\x13\xe5*\xcc\xd2\x0b\\\x9c\x9e\xfd\x99EV\x10',
          { expiresIn: '1h' },
        );
        userController.updateUser(contactFinded._id, {active: true, authToken: token, signUpToken: " "});
        return token;
      }else{
      return new Error("Error with sign up token, try again");
    }
      
    },
  },
};

export default userResolver;
