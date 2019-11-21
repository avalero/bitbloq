import { config } from "dotenv";
config();

import { create } from "simple-oauth2";
import { request } from "https";

interface IMSData {
  displayName: string;
  surname: string;
  givenName: string;
  id: string;
  userPrincipalName: string;
  businessPhones: string[];
  jobTitle: string;
  mail: string;
  mobilePhone: string;
  officeLocation: string;
  preferredLanguage: string;
}

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
const oauth2 = create(credentials);

export function getAuthMicrosoftUrl() {
  const returnVal = oauth2.authorizationCode.authorizeURL({
    redirect_uri: process.env.REDIRECT_URI,
    scope: process.env.APP_SCOPES
  });
  console.log(`Generated auth url: ${returnVal}`);
  return returnVal;
}

export const getUser = (token): Promise<IMSData> => {
  const getOptions = {
    host: "graph.microsoft.com",
    path: "/v1.0/me",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  // Set up the request
  return new Promise((resolve, reject) => {
    let userData: IMSData;
    const req = request(getOptions);

    req.on("response", res => {
      res.setEncoding("utf8");
      res.on("data", data => {
        userData = JSON.parse(data);
        resolve(userData);
      });
    });

    req.on("error", err => {
      console.log("err");
      reject(err);
    });
    req.end();
  });
};
