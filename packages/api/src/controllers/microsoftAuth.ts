import { request } from "https";
import { ApolloError } from "apollo-server";
import axios from "axios";
import { stringify } from "querystring";
import FormData from "form-data";
export interface IMSData {
  error?: JSON;
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

export const getMicrosoftUser = async (token): Promise<IMSData> => {
  const meQuery = {
    host: "https://graph.microsoft.com",
    path: `/v1.0/me`, // "/v1.0/me",
    method: "GET",
    headers: {
      // "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`
    }
  };

  const queryData = {
    client_id: process.env.MICROSOFT_APP_ID,
    scope: "User.Read",
    code: token,
    redirect_uri: "http://localhost:8000/microsoft-redirect",
    grant_type: "authorization_code",
    client_secret: process.env.MICROSOFT_APP_SECRET,
    state: 12345
  };

  let accessToken: string;
  try {
    const result = await axios.post(
      "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      stringify(queryData)
    );
    // console.log("data", result.data)
    accessToken = result.data.access_token;
  } catch (e) {
    console.log("token", e);
  }

  // Set up the request
  return new Promise((resolve, reject) => {
    console.log({ accessToken });
    if (accessToken) {
      try {
        axios
          .get("https://graph.microsoft.com/v1.0/me", {
            headers: { Authorization: `Bearer ${accessToken}` }
          })
          .then(response => {
            resolve(response.data);
          });
      } catch (e) {
        reject(e);
      }
    }
  });
};
