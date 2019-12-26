import React, { FC } from "react";
import styled from "@emotion/styled";
import { DialogModal, useTranslate } from "@bitbloq/ui";
import LoginForm from "./LoginForm";
import { setToken } from "../lib/session";

interface IDocumentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DocumentLoginModal: FC<IDocumentLoginModalProps> = ({
  isOpen,
  onClose
}) => {
  const t = useTranslate();

  const onLoginSuccess = (token: string) => {
    setToken(token);
    onClose();
  };

  return (
    <DialogModal
      isOpen={isOpen}
      title={t("general-enter-button")}
      cancelText={t("general-cancel-button")}
      onCancel={onClose}
      horizontalRule={true}
      content={<ModalLoginForm onLoginSuccess={onLoginSuccess} />}
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
