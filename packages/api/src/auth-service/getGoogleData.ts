import { request } from "https";

interface IGoogleData {
  error?: JSON;
  name: string;
  family_name: string;
  given_name: string;
  id: string;
  email: string;
  picture: string;
  birthDate: string;
}

const getGoogleUser = (token): Promise<IGoogleData | undefined> => {
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
    let userData: IGoogleData | undefined;
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
    });
    req.end();
  });
};

export { getGoogleUser };
