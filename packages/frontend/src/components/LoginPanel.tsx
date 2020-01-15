import Link from "next/link";
import React, { FC } from "react";
import styled from "@emotion/styled";
import { Button, useTranslate, colors } from "@bitbloq/ui";
import LoginForm from "./LoginForm";
import LoginWithGoogleButton from "./LoginWithGoogleButton";
import LoginWithMicrosoftButton from "./LoginWithMicrosoftButton";

interface ILoginPanelProps {
  onLoginSuccess: (token: string) => void;
  onSecondaryButton: () => void;
  secondaryButtonText: string;
}

const LoginPanel: FC<ILoginPanelProps> = props => {
  const t = useTranslate();
  const { onLoginSuccess, onSecondaryButton, secondaryButtonText } = props;
  return (
    <>
      {t("login.with")}
      <LoginWith>
        <LoginWithMicrosoftButton />
        <LoginWithGoogleButton />
      </LoginWith>
      <Divider>{t("login.divider")}</Divider>
      <Form>
        <LoginForm onLoginSuccess={onLoginSuccess} />
        <StyledButton secondary onClick={onSecondaryButton}>
          {secondaryButtonText}
        </StyledButton>
        <Link href="/forgot-password" prefetch={false}>
          <a>{t("login.forgot-password")}</a>
        </Link>
      </Form>
    </>
  );
};

export default LoginPanel;

const Divider = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  &::after,
  &::before {
    border-bottom: 1px solid grey;
    content: "";
    display: inline-block;
    height: 0;
    margin: 10px 0;
    width: calc(50% - 14px);
  }
`;

const LoginWith = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
`;

const Form = styled.div`
  a {
    color: ${colors.brandBlue};
    display: block;
    font-size: 14px;
    font-style: italic;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
  }
`;

const StyledButton = styled(Button)`
  margin-bottom: 10px;
  width: 100%;
`;
