import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import { Button, DialogModal, useTranslate } from "@bitbloq/ui";
import { useMutation } from "@apollo/react-hooks";
import LoginForm from "./LoginForm";
import { setToken } from "../lib/session";
import { LOGIN_MUTATION } from "../apollo/queries";

interface IDocumentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DocumentLoginModal: FC<IDocumentLoginModalProps> = ({ isOpen, onClose }) => {
  const t = useTranslate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [login] = useMutation(LOGIN_MUTATION);

  const close = () => {
    setEmail("");
    setPassword("");
    setLoginError(false);
    onClose();
  };

  const onOkClick = async () => {
    try {
      setLoginError(false);
      const result = await login({ variables: { email, password } });
      setToken(result.data.login);
      close();
    } catch (e) {
      setLoginError(true);
    }
  };


  return (
    <DialogModal
      isOpen={isOpen}
      title={t("general-enter-button")}
      okText={t("general-enter-button")}
      cancelText={t("general-cancel-button")}
      onOk={onOkClick}
      onCancel={close}
      horizontalRule={true}
      content={
        <ModalLoginForm
          email={email}
          loginError={loginError}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
        />
      }
    />
  );
};

export default DocumentLoginModal;

const ModalLoginForm = styled(LoginForm)`
  label {
    font-size: 14px;
    text-align: left;
  }

  & > div:last-of-type {
    margin-bottom: 30px;
  }
`;
