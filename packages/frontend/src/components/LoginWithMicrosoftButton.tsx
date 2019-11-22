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

const LoginWithMicrosoftButton: FC = () => {
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();

    sessionStorage.setItem("microsoftAuthState", uuid());
    sessionStorage.setItem("microsoftAuthNonce", uuid());

    const location = window.location;

    const authParams = {
      response_type: "id_token token",
      client_id: appID,
      redirect_uri: `${location.protocol}//${location.host}/microsoft-redirect`,
      scope: microsoftScopes,
      state: sessionStorage.getItem("microsoftAuthState"),
      nonce: sessionStorage.getItem("microsoftAuthNonce"),
      response_mode: "fragment"
    };

    location.assign(microsoftAuthEndpoint + queryString.stringify(authParams));
  };

  return (
    <Button tertiary onClick={onClick}>
      <Logo src={logoMicrosoftImage} alt="Microsoft" />
    </Button>
  );
};

export default LoginWithMicrosoftButton;

/* Styled components */

const Logo = styled.img`
  height: 40px;
`;
