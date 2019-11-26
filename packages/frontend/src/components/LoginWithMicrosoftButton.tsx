import { useRouter } from "next/router";
import queryString from "query-string";
import React, { FC } from "react";
import { v1 } from "uuid";
import styled from "@emotion/styled";
import { Button } from "@bitbloq/ui";
import { microsoftAuthEndpoint, microsoftScopes } from "../config";
import logoMicrosoftImage from "../images/logo-microsoft.png";
import env from "../lib/env";

const uuid = v1;

const appID: string = String(env.MICROSOFT_APP_ID);

const LoginWithMicrosoftButton: FC = () => {
  const router = useRouter();

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();

    sessionStorage.setItem("microsoftAuthState", uuid());
    sessionStorage.setItem("microsoftAuthNonce", uuid());
    sessionStorage.setItem("microsoftPrevPathname", router.pathname);

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
    <StyledButton quaternary onClick={onClick}>
      <Logo src={logoMicrosoftImage} alt="Microsoft" />
    </StyledButton>
  );
};

export default LoginWithMicrosoftButton;

/* Styled components */

const Logo = styled.img`
  height: 40px;
`;

const StyledButton = styled(Button)`
  width: 145px;
`;
