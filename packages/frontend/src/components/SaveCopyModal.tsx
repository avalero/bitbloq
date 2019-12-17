import React, { FC, useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import { Button, Input, Modal, DialogModal, useTranslate } from "@bitbloq/ui";
import { useMutation } from "@apollo/react-hooks";
import { DOCUMENTS_QUERY, CREATE_DOCUMENT_MUTATION } from "../apollo/queries";
import useUserData from "../lib/useUserData";
import { IDocument } from "../../../api/src/api-types";

interface ISaveCopyModalProps {
  onClose: () => any;
  document: IDocument;
  content: any;
  type: "example" | "exercise";
}

const SaveCopyModal: FC<ISaveCopyModalProps> = ({
  onClose,
  document,
  content,
  type
}) => {
  const t = useTranslate();
  let userData = useUserData();
  userData = userData && userData.userData;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAccountDialog, setShowAccountDialog] = useState(!!userData);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const emailInput = useRef<HTMLInputElement>(null);

  const [createDocument] = useMutation(CREATE_DOCUMENT_MUTATION);

  useEffect(() => {
    if (emailInput.current) {
      emailInput.current.focus();
    }
  }, []);

  const onSave = async () => {
    try {
      setLoginError(false);
      await createDocument({
        variables: {
          ...document,
          content,
          image: {
            image: document.image!.image
              ? document.image!.image
              : document.image,
            isSnapshot:
              document.image!.isSnapshot !== undefined
                ? document.image!.isSnapshot
                : false
          }
        },
        context: {
          email,
          password
        },
        refetchQueries: userData ? [{ query: DOCUMENTS_QUERY }] : []
      });
      setShowSaveSuccess(true);
    } catch (e) {
      setLoginError(true);
    }
  };

  if (showSaveSuccess) {
    return (
      <DialogModal
        isOpen={true}
        title={t("save-copy-modal.title.copy-added")}
        text={t(`save-copy-modal.text.copy-added.${type}`)}
        okText={t("save-copy-modal.buttons.ok")}
        onOk={onClose}
      />
    );
  }

  if (showAccountDialog) {
    return (
      <DialogModal
        isOpen={true}
        title={t("save-copy-modal.title.select-account")}
        text={t("save-copy-modal.text.select-account")}
        content={
          <OtherAccountDialog>
            <Button onClick={() => onSave()}>
              {t("save-copy-modal.buttons.add.to-account")}
            </Button>
            <Separator />
            <Button tertiary onClick={() => setShowAccountDialog(false)}>
              {t("save-copy-modal.buttons.add.to-another-account")}
            </Button>
          </OtherAccountDialog>
        }
        cancelText={t("save-copy-modal.buttons.cancel")}
        onCancel={onClose}
      />
    );
  }

  return (
    <Modal
      isOpen
      title={t(`save-copy-modal.title.add-copy.${type}`)}
      onClose={onClose}
    >
      <Content>
        <p>{t("save-copy-modal.text.add-copy")}</p>
        <LoginForm>
          <FormGroup>
            <label>{t("save-copy-modal.text.email")}</label>
            <Input
              value={email}
              ref={emailInput}
              error={loginError}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              placeholder={t("save-copy-modal.text.email")}
            />
          </FormGroup>
          <FormGroup>
            <label>{t("save-copy-modal.text.password")}</label>
            <Input
              value={password}
              type="password"
              error={loginError}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              placeholder={t("save-copy-modal.text.password")}
            />
          </FormGroup>
        </LoginForm>
        {loginError && <Error>{t("save-copy-modal.text.error")}</Error>}
        <Buttons>
          <Button onClick={() => onSave()}>
            {t("save-copy-modal.buttons.add.copy")}
          </Button>
        </Buttons>
      </Content>
    </Modal>
  );
};

export default SaveCopyModal;

const Content = styled.div`
  width: 500px;
  padding: 40px 30px 30px 30px;
  box-sizing: border-box;
  font-size: 14px;
`;

const LoginForm = styled.div`
  display: flex;
  margin: 40px -10px 0px -10px;
`;

const FormGroup = styled.div`
  margin: 0px 10px;
  flex: 1;
  label {
    display: block;
    margin-bottom: 10px;
  }
`;

const Error = styled.div`
  font-size: 12px;
  font-style: italic;
  color: #d82b32;
  margin-top: 10px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 40px;
`;

const OtherAccountDialog = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;

  button {
    width: 100%;
  }
`;

const Separator = styled.div`
  margin: 20px 0px;
  height: 1px;
  width: 100%;
  background-color: #ccc;
`;
