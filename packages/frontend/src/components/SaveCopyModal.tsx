import React, { FC, useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import { Button, Input, Modal, DialogModal, Option } from "@bitbloq/ui";

interface SaveCopyModalProps {
  user?: any;
  onSave: (email?: string, password?: string) => any;
  onCancel: () => any;
}

const SaveCopyModal: FC<SaveCopyModalProps> = ({ user, onSave, onCancel }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAccountDialog, setShowAccountDialog] = useState(!!user);
  const emailInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (emailInput.current) {
      emailInput.current.focus();
    }
  }, []);

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
        onCancel={() => onCancel()}
      />
    );
  }

  return (
    <Modal
      isOpen
      title="Añadir una copia del ejemplo a mis documentos"
      onClose={onCancel}
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              placeholder="Contraseña"
            />
          </FormGroup>
        </LoginForm>
        <Buttons>
          <Button onClick={() => onSave(email, password)}>Añadir copia</Button>
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
  margin: 40px -10px;
`;

const FormGroup = styled.div`
  margin: 0px 10px;
  flex: 1;
  label {
    display: block;
    margin-bottom: 10px;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
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
