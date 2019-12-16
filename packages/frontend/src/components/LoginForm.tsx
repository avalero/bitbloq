import React, { FC } from "react";
import { Input, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import ErrorMessage from "./ErrorMessage";

interface IFormProps {
  className?: string;
  email: string;
  loginError: boolean;
  password: string;
  setEmail(email: string): void;
  setPassword(password: string): void;
}

const LoginForm: FC<IFormProps> = ({
  className,
  email,
  loginError,
  password,
  setEmail,
  setPassword
}) => {
  const t = useTranslate();

  return (
    <div className={className}>
      <FormGroup>
        <label>{t("login.labels.email")}</label>
        <Input
          autoFocus
          name="email"
          type="text"
          placeholder={t("login.placeholders.email")}
          value={email}
          error={loginError}
          onChange={e => setEmail(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <label>{t("login.labels.password")}</label>
        <Input
          name="email"
          type="password"
          placeholder={t("login.placeholders.password")}
          value={password}
          error={loginError}
          onChange={e => setPassword(e.target.value)}
        />
      </FormGroup>
      {loginError && <LoginErrorMessage>{t("login.error")}</LoginErrorMessage>}
    </div>
  );
};

export default LoginForm;

const LoginErrorMessage = styled(ErrorMessage)`
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  label {
    display: block;
    margin-bottom: 10px;
  }
`;
