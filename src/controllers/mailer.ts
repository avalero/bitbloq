import { ApolloError } from 'apollo-server-koa';

const nodemailer = require('nodemailer');

const mailerController = {
  sendEmail: async (receiver: String, subject: String, message: String) => {
    const transporter = nodemailer.createTransport({
      host: process.env.MAILER_HOST,
      port: process.env.MAILER_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAILER_FROM,
      to: receiver,
      subject: subject,
      html: message,
    };

    const info = await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return new ApolloError(
          'Error sending message',
          'SENDING_MESSAGE_ERROR',
        );
      }
      console.log(info.response);
      console.log('Message sent: %s', info.messageId);
    });
  },
};

export { mailerController };
