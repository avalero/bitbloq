import React, { FC, useState, useEffect } from "react";
import useForm from "react-hook-form";
import { Input, useTranslate, Button } from "@bitbloq/ui";
import styled from "@emotion/styled";
import ErrorMessage from "./ErrorMessage";
import { ILogin } from "../types";

interface IFormProps {
  className?: string;
  loggingIn: boolean;
  loginError: boolean;
  onLogin: (input: ILogin) => void;
}

const LoginForm: FC<IFormProps> = ({
  className,
  loggingIn,
  loginError,
  onLogin
}) => {
  const t = useTranslate();
  const { handleSubmit, register } = useForm();
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setError(loginError);
  }, [loginError]);

  return (
    <form className={className} onSubmit={handleSubmit(onLogin)}>
      <FormGroup>
        <label>{t("login.labels.email")}</label>
        <Input
          autoFocus
          name="email"
          type="text"
          placeholder={t("login.placeholders.email")}
          ref={register({})}
          error={error}
          onChange={() => setError(false)}
        />
      </FormGroup>
      <FormGroup>
        <label>{t("login.labels.password")}</label>
        <Input
          name="password"
          type="password"
          placeholder={t("login.placeholders.password")}
          ref={register({})}
          error={error}
          onChange={() => setError(false)}
        />
        {error && <LoginErrorMessage>{t("login.error")}</LoginErrorMessage>}
      </FormGroup>
      <StyledButton type="submit" disabled={loggingIn}>
        {t("login.ok")}
      </StyledButton>
    </form>
  );
};

export default LoginForm;

const LoginErrorMessage = styled(ErrorMessage)`
  margin-top: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  label {
    display: block;
    margin-bottom: 10px;
  }
`;

const StyledButton = styled(Button)`
  margin: 30px 0 10px;
  width: 100%;
`;
