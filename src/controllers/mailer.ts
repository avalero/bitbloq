const nodemailer = require('nodemailer');
const config = require('./config');

const mailerController = {
  // async..await is not allowed in global scope, must use a wrapper
  sendEmail: async (receiver: String, subject: String, message: String) => {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // const account = await nodemailer.createTestAccount();

    const domain: String = '@gmail.com';
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // 'secure' option defaults to 'false' if port is 587 (recommended in most cases)
      requireTLS: true,
      auth: {
        user: config.mailer.auth.user + domain,
        pass: config.mailer.auth.password,
      },
    });

    //     {
    //   host: 'bq.com', // smtp.ethereal.email
    //   port: 587,
    //   secure: false, // true for 465, false for other ports
    // //   auth: {
    // //     user: account.user, // generated ethereal user
    // //     pass: account.pass, // generated ethereal password
    // //   },
    //   auth: {
    //     user: config.mailer.auth.user,
    //     pass: config.mailer.auth.password,
    //   },
    // });

    // setup email data with unicode symbols
    const mailOptions = {
      from: 'pp9989064@gmail.com', // sender address
      to: receiver, // list of receivers
      subject: subject, // Subject line
      text: message, // plain text body
      //html: '<b>message</b>', // html body
    };

    // send mail with defined transport object
    const info = await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return new Error('Error sending message');
      }
      console.log(info.response);
      console.log('Message sent: %s', info.messageId);
    });

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  },
};

export { mailerController };
