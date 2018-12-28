import { userController } from '../controllers/user.controller';
import { publicUserController } from '../public/publicUser.controller';

const userResolver = {
  Mutation: {
    //public methods:
    signUpUser(root: any, args: any) {
      return userController.signUpUser(root, args);
    },
    login(root: any, { email, password }) {
      return userController.login(root, {
        email: email,
        password: password,
      });
    },
    //private methods:
    activateAccount(root: any, args: any) {
      return userController.activateAccount(root, args);
    },
    deleteUser(root: any, args:any, context: any) {
      return userController.deleteUser(root, args, context);
    },
    updateUser(root: any, args:any, context: any) {
      return userController.updateUser(root, args, context);
    },
  },
  Query: {
    allUsers(root: any, args: any, context: any) {
      return userController.findAllUsers(root, args, context);
    },
  },
};

export default userResolver;
