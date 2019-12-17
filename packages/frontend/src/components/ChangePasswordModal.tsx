import React, { FC, useState } from "react";
import { useMutation } from "react-apollo";
import styled from "@emotion/styled";
import { DialogModal, Button, Input, Modal, useTranslate } from "@bitbloq/ui";
import { CHANGE_PASSWORD_MUTATION } from "../apollo/queries";
import ErrorMessage from "./ErrorMessage";

interface IChangePasswordModalProps {
  className?: string;
  disabledSave?: boolean;
  title?: string;
  onCancel: () => any;
  transparentOverlay?: boolean;
  isOpen?: boolean;
}

const ChangePasswordModal: FC<IChangePasswordModalProps> = props => {
  const {
    className,
    disabledSave = false,
    onCancel,
    isOpen = true,
    transparentOverlay
  } = props;
  const [changePassword] = useMutation(CHANGE_PASSWORD_MUTATION);
  const [currentPass, setCurrentPass] = useState<string>("");
  const [newPass, setNewPass] = useState<string>("");
  const [passChanged, setPassChanged] = useState<boolean>(false);
  const [repeatPass, setRepeatPass] = useState<string>("");
  const [errorCurrent, setErrorCurrent] = useState<string>("");
  const [errorNew, setErrorNew] = useState<string>("");
  const [errorRepeat, setErrorRepeat] = useState<string>("");

  const t = useTranslate();

  const passwordsAreValid = (): boolean => {
    let error = false;
    if (!currentPass) {
      setErrorCurrent(t("account.user-data.password.empty-error"));
      error = error || true;
    }
    if (!newPass) {
      setErrorNew(t("account.user-data.password.empty-error"));
      error = error || true;
    }
    if (!repeatPass) {
      setErrorRepeat(t("account.user-data.password.empty-error"));
      error = error || true;
    } else if (newPass !== repeatPass) {
      setErrorNew(t("account.user-data.password.repeat-error"));
      setErrorRepeat(t("account.user-data.password.repeat-error"));
      error = error || true;
    }
    return !error;
  };

  const onClose = () => {
    setCurrentPass("");
    setNewPass("");
    setRepeatPass("");
    setErrorCurrent("");
    setErrorNew("");
    setErrorRepeat("");
    setPassChanged(false);
    onCancel();
  };

  const onSubmitPasswords = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordsAreValid()) {
      changePassword({
        variables: {
          currentPassword: currentPass,
          newPassword: newPass
        }
      })
        .then(() => {
          setPassChanged(true);
        })
        .catch(error => {
          if (
            error.graphQLErrors &&
            error.graphQLErrors[0] &&
            error.graphQLErrors[0].extensions.code === "INCORRECT_PASSWORD"
          ) {
            setErrorCurrent(t("account.user-data.password.wrong-error"));
          }
        });
    }
  };

  return (
    <>
      <DialogModal
        isOpen={isOpen && passChanged}
        title={t("account.user-data.password.password-changed-title")}
        text={t("account.user-data.password.password-changed")}
        okText={t("general-accept-button")}
        onOk={onClose}
      />
      <Modal
        className={className}
        isOpen={isOpen && !passChanged}
        title={t("account.user-data.password.button")}
        onClose={onClose}
        transparentOverlay={transparentOverlay}
      >
        <Content>
          <form onSubmit={onSubmitPasswords}>
            <p>{t("account.user-data.password.change-text")}</p>
            <InputLabel>
              {t("account.user-data.password.current-placeholder")}
            </InputLabel>
            <Input
              placeholder={
                currentPass ||
                t("account.user-data.password.current-placeholder")
              }
              onChange={e => {
                const value: string = e.target.value;
                setErrorCurrent("");
                setCurrentPass(value);
              }}
              value={currentPass}
              type="password"
              error={!!errorCurrent}
            />
            {errorCurrent && (
              <InputErrorMessage>{errorCurrent}</InputErrorMessage>
            )}
            <InputLabel>
              {t("account.user-data.password.new-placeholder")}
            </InputLabel>
            <Input
              placeholder={
                newPass || t("account.user-data.password.new-placeholder")
              }
              onChange={e => {
                const value: string = e.target.value;
                setErrorNew("");
                setNewPass(value);
              }}
              value={newPass}
              type="password"
              error={!!errorNew}
            />
            {errorNew && <InputErrorMessage>{errorNew}</InputErrorMessage>}
            <InputLabel>
              {t("account.user-data.password.repeat-placeholder")}
            </InputLabel>
            <Input
              placeholder={
                repeatPass || t("account.user-data.password.repeat-placeholder")
              }
              onChange={e => {
                const value: string = e.target.value;
                setErrorRepeat("");
                setRepeatPass(value);
              }}
              value={repeatPass}
              type="password"
              error={!!errorRepeat}
            />
            {errorRepeat && (
              <InputErrorMessage>{errorRepeat}</InputErrorMessage>
            )}
            <Buttons>
              <Button
                tertiary
                type="button"
                onClick={() => {
                  onClose();
                }}
              >
                {t("general-cancel-button")}
              </Button>
              <Button
                type="submit"
                disabled={
                  disabledSave || !!errorCurrent || !!errorNew || !!errorRepeat
                }
              >
                {t("general-change-button")}
              </Button>
            </Buttons>
          </form>
        </Content>
      </Modal>
    </>
  );
};

export default ChangePasswordModal;

/* styled components */

const Content = styled.div`
  padding: 30px;
  width: 500px;
  box-sizing: border-box;

  p {
    color: #5d6069;
    font-size: 14px;
    line-height: 1.57;
    margin: 10px 0 40px !important;
  }
`;

const Buttons = styled.div`
  display: flex;
  margin-top: 50px;
  justify-content: space-between;
  ${Button} {
    height: 40px;
    border-radius: 4px;
  }
`;

const InputErrorMessage = styled(ErrorMessage)`
  margin-top: 10px;
`;

const InputLabel = styled.label`
  color: #323843;
  display: inline-block;
  font-size: 14px;
  height: 16px;
  margin: 20px 0 10px;

  &:first-of-type {
    margin-top: 0;
  }
`;
