import {userController} from '../controllers/user.controller';

const userResolver = {
  Mutation: {
    signUpUser(root: any, args: any) {
      return userController.signUpUser(root, args);
    },
    activateAccount(root: any, args: any) {
      return userController.activateAccount(root, args);
    },
    login(root: any, args: any) {
      return userController.login(root, args);
    },
    deleteUser(root: any, args: any) {
      return userController.deleteUser(root, args);
    },
    updateUser(root: any, args: any) {
      return userController.updateUser(root, args);
    },
  },
  Query: {
    allUsers(root: any, args: any) {
      return userController.findAllUsers(root, args);
    },
  },
};

export default userResolver;
