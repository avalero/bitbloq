import {UserMong} from '../models/userModel';

const userController = {
  signUpUser: async (_, {input}) => {
    const user_new = new UserMong({
      email: input.email,
      password: input.password,
      name: input.name,
      center: input.center,
      active: input.active,
      signUpToken: input.sign_up_token,
      authToken: input.auth_token,
      notifications: input.notifications
    });
    console.log('You signed up');
    //TODO: singup token
    return UserMong.create(user_new);
  },
  deleteUser: async (root: any, args: any) =>
    UserMong.deleteOne({ email: args.email }),
  updateUser: async (root: any, args: any) => {
    const tempUser = { ...args };
    delete tempUser.id;
    return UserMong.updateOne({ _id: args.id }, { $set: tempUser });
  },
  findAllUsers: async (root: any, args: any) => UserMong.find({}),

  activateAccount: async (root: any, args: any) => {
    //TODO: activate account
  },
  login: async (root: any, args: any) => {
    UserMong.find({ email: args.email }, function(error, contactFinded) {
      console.log(contactFinded);
      /* if (contactFinded.password === args.password) {
        console.log('You logged in');
        //TODO: singin token
      } else {
        console.log('pass not match');
      }*/
    });
  },
};

export {userController};
