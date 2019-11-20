import { config } from "dotenv";
config();

var querystring = require("querystring");
var http = require("http");
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
  const get_data = querystring.stringify({
    compilation_level: "ADVANCED_OPTIMIZATIONS",
    output_format: "json",
    output_info: "compiled_code",
    warning_level: "QUIET"
  });
  const get_options = {
    host: "graph.microsoft.com",
    port: "80",
    path: "/v1.0/me",
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: token
    }
  };

  // Set up the request
  const get_req = http.request(get_options, function(res) {
    res.setEncoding("utf8");
    res.on("data", function(chunk) {
      console.log("Response: " + chunk);
    });
  });

  // post the data
  get_req.write(get_data);
  get_req.end();
}

function PostCode(codestring) {
  // Build the post string from an object
  var post_data = querystring.stringify({
    compilation_level: "ADVANCED_OPTIMIZATIONS",
    output_format: "json",
    output_info: "compiled_code",
    warning_level: "QUIET",
    js_code: codestring
  });

  // An object of options to indicate where to post to
  var post_options = {
    host: "closure-compiler.appspot.com",
    port: "80",
    path: "/compile",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(post_data)
    }
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
    res.setEncoding("utf8");
    res.on("data", function(chunk) {
      console.log("Response: " + chunk);
    });
  });

  // post the data
  post_req.write(post_data);
  post_req.end();
}
