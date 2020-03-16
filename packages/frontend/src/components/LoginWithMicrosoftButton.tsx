import { useRouter } from "next/router";
import queryString from "query-string";
import React, { FC } from "react";
import { v1 } from "uuid";
import styled from "@emotion/styled";
import { Button } from "@bitbloq/ui";
import { microsoftAuthEndpoint, microsoftScopes } from "../config";
import logoMicrosoftImage from "../images/logo-microsoft.svg";
import env from "../lib/env";

const uuid = v1;

const appID: string = String(env.MICROSOFT_APP_ID);
const appSecret: string = String(env.MICROSOFT_APP_SECRET);
const token: string = String(env.MICROSOFT_TOKEN_ENDPOINT);
const scopes: string = String(env.MS_GRAPH_SCOPE);

const postData = {
  client_id: appID,
  scope: scopes,
  client_secret: appSecret,
  grant_type: "client_credentials"
};

const LoginWithMicrosoftButton: FC = () => {
  const router = useRouter();

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // sessionStorage.setItem("microsoftAuthState", uuid());
    // sessionStorage.setItem("microsoftAuthNonce", uuid());
    // sessionStorage.setItem("microsoftPrevPathname", router.pathname);

    const location = window.location;
    const authParams = {
      response_type: "code",
      client_id: appID,
      client_secret: appSecret,
      redirect_url: `${location.protocol}//${location.host}/microsoft-redirect`,
      scope: microsoftScopes,
      state: 12345,
      response_mode: "query"
    };
    // location.assign(microsoftAuthEndpoint + queryString.stringify(authParams));
    location.assign(`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?
      client_id=${appID}
      &response_type=code
      &redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fmicrosoft-redirect
      &response_mode=query
      &scope=User.Read
      &state=12345`);
  };

  return (
    <StyledButton quaternary onClick={onClick}>
      <Logo src={logoMicrosoftImage} alt="Microsoft" />
    </StyledButton>
  );

  // return (
  //   <DisabledButton quaternary>
  //     <Logo src={logoMicrosoftImage} alt="Microsoft" />
  //   </DisabledButton>
  // );
};

export default LoginWithMicrosoftButton;

/* Styled components */

const Logo = styled.img`
  height: 38px;
`;

const StyledButton = styled(Button)`
  width: 145px;
`;

const DisabledButton = styled(StyledButton)`
  cursor: not-allowed;
  filter: grayscale(100%);

  &:hover {
    background-color: initial;
  }
`;
