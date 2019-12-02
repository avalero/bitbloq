import Link from "next/link";
import React, { FC } from "react";
import styled from "@emotion/styled";
import { Button, useTranslate } from "@bitbloq/ui";
import LoginForm from "./LoginForm";
import LoginWithGoogleButton from "./LoginWithGoogleButton";
import LoginWithMicrosoftButton from "./LoginWithMicrosoftButton";

interface ILoginPanelProps {
  email: string;
  loginError: boolean;
  loginIn: boolean;
  password: string;
  onLoginClick: () => any;
  secondaryButtonCallback: () => any;
  secondaryButtonText: string;
  setEmail(email: string): void;
  setPassword(password: string): void;
}

const LoginPanel: FC<ILoginPanelProps> = props => {
  const t = useTranslate();
  const {
    email,
    loginError,
    loginIn,
    password,
    onLoginClick,
    secondaryButtonCallback,
    secondaryButtonText,
    setEmail,
    setPassword
  } = props;
  return (
    <>
      {t("login.with")}
      <LoginWith>
        <LoginWithMicrosoftButton />
        <LoginWithGoogleButton />
      </LoginWith>
      <Divider>{t("login.divider")}</Divider>
      <Form onSubmit={(event: React.FormEvent) => event.preventDefault()}>
        <LoginForm
          email={email}
          loginError={loginError}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
        />
        <StyledButton type="submit" onClick={onLoginClick} disabled={loginIn}>
          {t("login.ok")}
        </StyledButton>
        <StyledButton secondary onClick={secondaryButtonCallback}>
          {secondaryButtonText}
        </StyledButton>
        <Link href="/forgot-password">
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

const Form = styled.form`
  a {
    color: #00ade5;
    display: block;
    font-size: 14px;
    font-style: italic;
    font-weight: bold;
    margin-top: 4px;
    text-align: center;
    text-decoration: none;
  }
`;

const StyledButton = styled(Button)`
  margin-bottom: 10px;
  width: 100%;
`;
