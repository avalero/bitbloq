import { config } from "dotenv";
config();

var querystring = require("querystring");
var http = require("http");
const https = require("https");
var fs = require("fs");

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
  console.log("Token created: ", token.token);
  //
  return token.token.access_token;
}

export function getUser(token) {
  const getOptions = {
    host: "graph.microsoft.com",
    path: "/v1.0/me",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  let userData;
  // Set up the request
  const hello = https.request(getOptions, res => {
    res.on("error", e => {
      console.log("error", e);
      return e;
    });
    res.setEncoding("utf8");
    res.on("data", data => {
      userData = JSON.parse(data);
      console.log(userData.displayName, userData.surname, userData.givenName);
      console.log("Response: " + data);
    });
    res.on("end", () => {
      console.log("No more data in response.");
      return { name: userData.givenName, surnames: userData.surname };
    });
  });
  // hello.on("error", e => console.log("error", e));
  hello.end();
}
