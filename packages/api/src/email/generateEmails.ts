import { compile } from "handlebars";
import fs from "fs";
import * as path from "path";
import mjml2html from "mjml";
import { ApolloError } from "apollo-server";

export const generateChangeEmailEmail = async (params): Promise<string> => {
  const result = fs.readFileSync(
    path.join(__dirname, "./changeEmail.mjml"),
    "utf8"
  );
  if (result) {
    const template = compile(result);
    const mail = mjml2html(template(params), {
      keepComments: false,
      beautify: true,
      minify: true
    });
    return mail.html;
  } else {
    throw new ApolloError("Error generating email", "ERROR_GENERATING_MAIL");
  }
};

export const generateResetPasswordEmail = async (params): Promise<string> => {
  const result = fs.readFileSync(
    path.join(__dirname, "./resetPassword.mjml"),
    "utf8"
  );
  if (result) {
    const template = compile(result);
    const mail = mjml2html(template(params), {
      keepComments: false,
      beautify: true,
      minify: true
    });
    return mail.html;
  } else {
    throw new ApolloError("Error generating email", "ERROR_GENERATING_MAIL");
  }
};

export const generateWelcomeEmail = async (params): Promise<string> => {
  const result = fs.readFileSync(
    path.join(__dirname, "./welcome.mjml"),
    "utf8"
  );
  if (result) {
    const template = compile(result);
    const mail = mjml2html(template(params), {
      keepComments: false,
      beautify: true,
      minify: true
    });
    return mail.html;
  } else {
    throw new ApolloError("Error generating email", "ERROR_GENERATING_MAIL");
  }
};
