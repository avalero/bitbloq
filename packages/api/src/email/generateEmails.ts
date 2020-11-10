import { compile } from "handlebars";
import fs from "fs";
import * as path from "path";
import mjml2html from "mjml";
import { IEmailData } from "../models/interfaces";
import { ApolloError } from "apollo-server-koa";
import * as nodemailer from "nodemailer";

const sendEmail = async (
  emailAddress: string,
  topic: string,
  mjmlFileName: string,
  data: IEmailData
) => {
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
  let htmlMessage;
  try {
    const email = fs.readFileSync(
      path.join(__dirname, `./mjml/${mjmlFileName}.mjml`),
      "utf8"
    );
    const template = compile(email);
    htmlMessage = mjml2html(template(data), {
      keepComments: false,
      beautify: true,
      minify: true
    });
  } catch (e) {
    return new ApolloError("Error generating email", "ERROR_GENERATING_EMAIL");
  }
  const mailOptions = {
    from: process.env.MAILER_FROM,
    to: emailAddress,
    subject: topic,
    html: htmlMessage.html
  };
  try {
    await await transporter.sendMail(mailOptions, err => {
      if (err) {
        console.error("Error sending email", err);
        return new ApolloError(
          "Error sending message",
          "SENDING_MESSAGE_ERROR"
        );
      }
      console.info("Email sent to", mailOptions.to);
      return;
    });
  } catch (e) {
    console.error(e);
    return new ApolloError("Error sending email", "ERROR_SENDING_EMAIL");
  }
  return "OK";
};

export default sendEmail;
