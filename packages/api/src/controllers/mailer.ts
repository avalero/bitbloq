import { ApolloError } from "apollo-server-koa";
import * as nodemailer from "nodemailer";

const mailerController = {
  sendEmail: async (receiver: string, subject: string, message: string) => {
    const transporter = nodemailer.createTransport({
      host: process.env.MAILER_HOST,
      port: process.env.MAILER_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.MAILER_FROM,
      to: receiver,
      subject,
      html: message
    };

    const info = await transporter.sendMail(mailOptions, err => {
      if (err) {
        return new ApolloError(
          "Error sending message",
          "SENDING_MESSAGE_ERROR"
        );
      }
    });
  }
};

export { mailerController };
