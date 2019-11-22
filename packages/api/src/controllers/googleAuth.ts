import { request } from "https";
import { ApolloError } from "apollo-server";

export interface IGoogleData {
  name: string;
  family_name: string;
  given_name: string;
  id: string;
  email: string;
  picture: string;
  birthDate: string;
}

export const getGoogleUser = (token): Promise<any> => {
  const getOptions = {
    hostname: "www.googleapis.com",
    path: "/oauth2/v2/userinfo",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  //   // Set up the request
  return new Promise((resolve, reject) => {
    let userData: IGoogleData;
    const req = request(getOptions);
    req.on("response", res => {
      res.setEncoding("utf8");
      res.on("data", data => {
        userData = JSON.parse(data);
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
