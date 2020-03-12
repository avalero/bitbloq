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

const credentials = {
  client: {
    id: appID,
    secret: appSecret
  },
  auth: {
    tokenHost: "https://login.microsoftonline.com",
    authorizePath: "common/oauth2/v2.0/authorize",
    tokenPath: "common/oauth2/v2.0/token"
  }
};
// export const oauth2 = require("simple-oauth2").create(credentials);

const LoginWithMicrosoftButton: FC = () => {
  const router = useRouter();

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();

    sessionStorage.setItem("microsoftAuthState", uuid());
    sessionStorage.setItem("microsoftAuthNonce", uuid());
    sessionStorage.setItem("microsoftPrevPathname", router.pathname);

    const location = window.location;
    const authParams = {
      response_type: "code",
      client_id: appID,
      client_secret: "Iwy-xauzE.HOXeBkJ/-VepPueZR6G453",
      redirect_url: `${location.protocol}//${location.host}/microsoft-redirect`,
      scope: microsoftScopes,
      state: sessionStorage.getItem("microsoftAuthState"),
      nonce: sessionStorage.getItem("microsoftAuthNonce"),
      response_mode: "fragment"
    };
    location.assign(microsoftAuthEndpoint + queryString.stringify(authParams));
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
