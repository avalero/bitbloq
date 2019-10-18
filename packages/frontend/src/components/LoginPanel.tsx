import React, { FC } from "react";
import styled from "@emotion/styled";
import { Link } from "gatsby";
import { Button } from "@bitbloq/ui";
import LoginForm from "./LoginForm";

interface LoginPanelProps {
  className?: string;
  email: string;
  logingError: boolean;
  logingIn: boolean;
  password: string;
  onLoginClick(): void;
  secondaryButtonCallback(): void;
  secondaryButtonText: string;
  setEmail(email: string): void;
  setPassword(password: string): void;
}

const LoginPanel: FC<LoginPanelProps> = (props: LoginPanelProps) => {
  const {
    className,
    email,
    logingError,
    logingIn,
    password,
    onLoginClick,
    secondaryButtonCallback,
    secondaryButtonText,
    setEmail,
    setPassword
  } = props;
  return (
    <Panel
      className={className}
      onSubmit={(event: Event) => event.preventDefault()}
    >
      <LoginForm
        email={email}
        logingError={logingError}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
      />
      <Button type="submit" onClick={() => onLoginClick()} disabled={logingIn}>
        Entrar
      </Button>
      <Button secondary onClick={secondaryButtonCallback}>
        {secondaryButtonText}
      </Button>
      <Link to="/forgot-password">No recuerdo mi contraseña</Link>
    </Panel>
  );
};

export default LoginPanel;

const Panel = styled.form`
  font-family: Roboto;

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

  button {
    margin-bottom: 10px;
    width: 100%;
  }
`;
