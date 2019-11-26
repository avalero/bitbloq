import { useRouter } from "next/router";
import queryString from "query-string";
import React, { FC } from "react";
import { v1 } from "uuid";
import styled from "@emotion/styled";
import { Button } from "@bitbloq/ui";
import { googleAuthEndpoint, googleScopes } from "../config";
import logoGoogleImage from "../images/logo-google.png";
import env from "../lib/env";

const uuid = v1;

const appID: string = String(env.GOOGLE_CLIENT_ID);

const LoginWithGoogleButton: FC = () => {
  const router = useRouter();

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();

    sessionStorage.setItem("googleAuthState", uuid());
    sessionStorage.setItem("googleAuthNonce", uuid());
    sessionStorage.setItem("googlePrevPathname", router.pathname);

    const location = window.location;
    const authParams = {
      response_type: "code token",
      client_id: appID,
      redirect_uri: `${location.protocol}//${location.host}/google-redirect`,
      scope: googleScopes,
      state: sessionStorage.getItem("googleAuthState"),
      nonce: sessionStorage.getItem("googleAuthNonce"),
      access_type: "offline"
    };

    location.assign(
      googleAuthEndpoint + "?" + queryString.stringify(authParams)
    );
  };

  return (
    <StyledButton quaternary onClick={onClick}>
      <Logo src={logoGoogleImage} alt="Google" />
    </StyledButton>
  );
};

export default LoginWithGoogleButton;

/* Styled components */

const Logo = styled.img`
  height: 40px;
`;

const StyledButton = styled(Button)`
  width: 145px;
`;
