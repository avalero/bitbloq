import React, { FC } from "react";
import { Input, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";

interface IFormProps {
  email: string;
  loginError: boolean;
  password: string;
  setEmail(email: string): void;
  setPassword(password: string): void;
}

const LoginForm: FC<IFormProps> = ({
  email,
  loginError,
  password,
  setEmail,
  setPassword
}) => {
  const t = useTranslate();

  return (
    <>
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
      {loginError && <ErrorMessage>{t("login.error")}</ErrorMessage>}
    </>
  );
};

export default LoginForm;

const ErrorMessage = styled.div`
  color: #d82b32;
  font-size: 12px;
  font-style: italic;
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  label {
    display: block;
    margin-bottom: 10px;
  }
`;
