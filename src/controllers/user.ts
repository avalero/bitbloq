import { UserModel } from '../models/user';
import { DocumentModelController } from './document';

const userController = {
  signUpUser: newUser => {
    return UserModel.create(newUser);
  },
  deleteUser: userID => {
    return UserModel.deleteOne({ _id: userID });
  },
  updateUser: async (userID, data) => {
    return UserModel.updateOne({ _id: userID }, { $set: data });
  },
  findAllUsers: () => {
    return UserModel.find({});
  },
};

export { userController };
