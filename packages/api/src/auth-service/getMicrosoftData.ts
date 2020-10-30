import axios from "axios";
import { stringify } from "querystring";
import { ISocialData } from "./authService";

const getMicrosoftUser = async (token): Promise<ISocialData> => {
  const queryData = {
    client_id: process.env.MICROSOFT_APP_ID,
    scope: "User.Read",
    code: token,
    redirect_uri: `${process.env.FRONTEND_URL}/microsoft-redirect`,
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
    accessToken = result.data.access_token;
  } catch (e) {
    console.log("error with code and getting user token", e);
  }

  return new Promise((resolve, reject) => {
    if (accessToken) {
      try {
        axios
          .get("https://graph.microsoft.com/v1.0/me", {
            headers: { Authorization: `Bearer ${accessToken}` }
          })
          .then(response => {
            resolve({
              name: response.data.displayName,
              surname: response.data.surname,
              id: response.data.id,
              email: response.data.mail
                ? response.data.mail
                : response.data.userPrincipalName
            });
          });
      } catch (e) {
        console.log("error getting user data", e);
        reject(e);
      }
    }
  });
};

export { getMicrosoftUser };
