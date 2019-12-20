import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import { Button, DialogModal, useTranslate } from "@bitbloq/ui";
import { useMutation } from "@apollo/react-hooks";
import LoginForm from "./LoginForm";
import { setToken } from "../lib/session";
import { LOGIN_MUTATION } from "../apollo/queries";
import { ILogin } from "../types";

interface IDocumentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DocumentLoginModal: FC<IDocumentLoginModalProps> = ({
  isOpen,
  onClose
}) => {
  const t = useTranslate();
  const [loginError, setLoginError] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [login] = useMutation(LOGIN_MUTATION);

  const onLogin = async (input: ILogin) => {
    try {
      setLoggingIn(false);
      setLoginError(false);
      const result = await login({
        variables: { email: input.email, password: input.password }
      });
      setToken(result.data.login);
      onClose();
    } catch (e) {
      setLoggingIn(false);
      setLoginError(true);
    }
  };

  return (
    <DialogModal
      isOpen={isOpen}
      title={t("general-enter-button")}
      cancelText={t("general-cancel-button")}
      onCancel={onClose}
      horizontalRule={true}
      content={
        <ModalLoginForm
          loggingIn={loggingIn}
          loginError={loginError}
          onLogin={onLogin}
        />
      }
    />
  );
};

export default DocumentLoginModal;

const ModalLoginForm = styled(LoginForm)`
  text-align: left;

  label {
    font-size: 14px;
  }
`;
