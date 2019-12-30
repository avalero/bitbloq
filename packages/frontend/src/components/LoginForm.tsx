import React, { FC, useState } from "react";
import { useMutation } from "react-apollo";
import useForm from "react-hook-form";
import { Input, useTranslate, Button } from "@bitbloq/ui";
import styled from "@emotion/styled";
import ErrorMessage from "./ErrorMessage";
import { LOGIN_MUTATION } from "../apollo/queries";
import { IMutationLoginArgs } from "../../../api/src/api-types";

interface IFormProps {
  className?: string;
  onLoginSuccess: (token: string) => void;
}

const LoginForm: FC<IFormProps> = ({ className, onLoginSuccess }) => {
  const t = useTranslate();
  const { handleSubmit, register } = useForm();
  const [error, setError] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [login] = useMutation(LOGIN_MUTATION);

  const onLogin = async (input: IMutationLoginArgs) => {
    try {
      setLoggingIn(true);
      const result = await login({ variables: input });
      onLoginSuccess(result.data.login);
    } catch (e) {
      setLoggingIn(false);
    }
  };

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
