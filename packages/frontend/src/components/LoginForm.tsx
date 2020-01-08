import React, { FC, useState } from "react";
import { useMutation } from "react-apollo";
import useForm from "react-hook-form";
import { DialogModal, Input, useTranslate, Button } from "@bitbloq/ui";
import styled from "@emotion/styled";
import CounterButton from "../components/CounterButton";
import ErrorMessage from "./ErrorMessage";
import { LOGIN_MUTATION, RESEND_WELCOME_EMAIL } from "../apollo/queries";
import { ILogin } from "../types";

interface IFormProps {
  className?: string;
  onLoginSuccess: (token: string) => void;
}

const LoginForm: FC<IFormProps> = ({ className, onLoginSuccess }) => {
  const t = useTranslate();
  const { handleSubmit, register } = useForm();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [notActiveError, setNotActiveError] = useState<boolean>(false);
  const [login] = useMutation(LOGIN_MUTATION);
  const [resendEmail] = useMutation(RESEND_WELCOME_EMAIL);

  const onLogin = async (input: ILogin) => {
    try {
      setLoggingIn(true);
      const result = await login({ variables: input });
      onLoginSuccess(result.data.login);
    } catch (e) {
      if (
        e.graphQLErrors &&
        e.graphQLErrors[0] &&
        e.graphQLErrors[0].extensions &&
        e.graphQLErrors[0].extensions.code === "NOT_ACTIVE_USER"
      ) {
        setEmail(input.email);
        setNotActiveError(true);
      } else {
        setError(true);
      }
      setLoggingIn(false);
    }
  };

  const onSendClick = () => {
    resendEmail({
      variables: { email }
    });
  };

  return (
    <>
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
          {error && <ErrorMessage>{t("login.error")}</ErrorMessage>}
        </FormGroup>
        <StyledButton type="submit" disabled={loggingIn}>
          {t("login.ok")}
        </StyledButton>
      </form>
      <DialogModal
        cancelText={t("signup.not-activate-modal.cancel")}
        isOpen={notActiveError}
        okButton={
          <CounterButton onClick={onSendClick}>
            {t("signup.not-activate-modal.ok")}
          </CounterButton>
        }
        onCancel={() => setNotActiveError(false)}
        text={t("signup.not-activate-modal.text")}
        title={t("signup.not-activate-modal.title")}
      />
    </>
  );
};

export default LoginForm;

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
