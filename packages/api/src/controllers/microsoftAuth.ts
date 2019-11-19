import { config } from "dotenv";
config();

const credentials = {
  client: {
    id: process.env.APP_ID,
    secret: process.env.APP_PASSWORD
  },
  auth: {
    tokenHost: "https://login.microsoftonline.com",
    authorizePath: "common/oauth2/v2.0/authorize",
    tokenPath: "common/oauth2/v2.0/token"
  }
};
const oauth2 = require("simple-oauth2").create(credentials);

export function getAuthMicrosoftUrl() {
  const returnVal = oauth2.authorizationCode.authorizeURL({
    redirect_uri: process.env.REDIRECT_URI,
    scope: process.env.APP_SCOPES
  });
  console.log(`Generated auth url: ${returnVal}`);
  return returnVal;
}

export async function getTokenFromCode(auth_code) {
    let result = await oauth2.authorizationCode.getToken({
      code: auth_code,
      redirect_uri: process.env.REDIRECT_URI,
      scope: process.env.APP_SCOPES
    });
  
    const token = oauth2.accessToken.create(result);
    console.log('Token created: ', token.token);
    return token.token.access_token;
  }
