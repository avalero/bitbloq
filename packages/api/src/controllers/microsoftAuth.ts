import { request } from "https";
import { ApolloError } from "apollo-server";

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

export const getMicrosoftUser = (token): Promise<IMSData> => {
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
    let userData: IMSData | undefined;
    const req = request(getOptions);

    req.on("response", res => {
      res.setEncoding("utf8");
      res.on("data", data => {
        userData = JSON.parse(data);
        if (userData && userData.error) {
          userData = undefined;
        }
        resolve(userData);
      });
    });

    req.on("error", err => {
      reject(err);
      throw new ApolloError("Error getting user data", "SOCIAL_DATA_ERROR");
    });
    req.end();
  });
};
