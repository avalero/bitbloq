import React, { FC, useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import { Button, Input, Modal, DialogModal, Option } from "@bitbloq/ui";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { DOCUMENTS_QUERY, CREATE_DOCUMENT_MUTATION } from "../apollo/queries";
import useUserData from "../lib/useUserData";

interface SaveCopyModalProps {
  onClose: () => any;
  document: any;
  content: any;
}

const SaveCopyModal: FC<SaveCopyModalProps> = ({
  onClose,
  document,
  content
}) => {
  const userData = useUserData();

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
          image: {
            image: document.image.image ? document.image.image : document.image,
            isSnapshot:
              document.image.isSnapshot !== undefined
                ? document.image.isSnapshot
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
        title="Copia añadida correctamente"
        text="Se ha añadido una copia de este ejemplo a tus documentos."
        okText="Aceptar"
        onOk={onClose}
      />
    );
  }

  if (showAccountDialog) {
    return (
      <DialogModal
        isOpen={true}
        title="Añadir copia a mis documentos"
        text="¿Añadir una copia a tu cuenta o a otra?"
        content={
          <OtherAccountDialog>
            <Button onClick={() => onSave()}>Añadir a tu cuenta</Button>
            <Separator />
            <Button tertiary onClick={() => setShowAccountDialog(false)}>
              Añadir a otra cuenta
            </Button>
          </OtherAccountDialog>
        }
        cancelText="Cancelar"
        onCancel={onClose}
      />
    );
  }

  return (
    <Modal
      isOpen
      title="Añadir una copia del ejemplo a mis documentos"
      onClose={onClose}
    >
      <Content>
        <p>
          Escribe el correo electrónico y la contraseña de tu cuenta para añadir
          la copia
        </p>
        <LoginForm>
          <FormGroup>
            <label>Correo electrónico</label>
            <Input
              value={email}
              ref={emailInput}
              error={loginError}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              placeholder="Correo electrónico"
            />
          </FormGroup>
          <FormGroup>
            <label>Contraseña</label>
            <Input
              value={password}
              type="password"
              error={loginError}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              placeholder="Contraseña"
            />
          </FormGroup>
        </LoginForm>
        {loginError && (
          <Error>El Correo electrónico o la contraseña no son correctos</Error>
        )}
        <Buttons>
          <Button onClick={() => onSave()}>Añadir copia</Button>
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
