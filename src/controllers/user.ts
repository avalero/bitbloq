import { UserModel } from '../models/user';
import { DocumentModelController } from './document';
//const nodemailer=require('nodemailer');

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

  // sendSignUpEmail: async (signUpToken, email)=>{
  //   const account=await nodemailer.createTestAccount();
  //   let transporter = nodemailer.createTransport({
  //     host: "smtp.ethereal.email",
  //     port: 587,
  //     secure: false, // true for 465, false for other ports
  //     auth: {
  //       user: account.user, // generated ethereal user
  //       pass: account.pass // generated ethereal password
  //     }
  //   });

  //   // setup email data with unicode symbols
  //   let mailOptions = {
  //     from: '"Fred Foo 👻" <foo@example.com>', // sender address
  //     to: "bar@example.com, baz@example.com", // list of receivers
  //     subject: "Hello ✔", // Subject line
  //     text: "Hello world?", // plain text body
  //     html: "<b>Hello world?</b>" // html body
  //   };

  //   // send mail with defined transport object
  //   let info = await transporter.sendMail(mailOptions)

  //   console.log("Message sent: %s", info.messageId);
  //   // Preview only available when sending through an Ethereal account
  //   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  //   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  //   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  // }
};

export { userController };
