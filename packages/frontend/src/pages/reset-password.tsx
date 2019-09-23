import React, { FC, useState, useEffect } from "react";
import queryString from "query-string";
import styled from "@emotion/styled";
import { useMutation } from "@apollo/react-hooks";
import { navigate } from "gatsby";
import { Input, Button } from "@bitbloq/ui";
import { UPDATE_PASSWORD_MUTATION } from "../apollo/queries";
import AccessLayout, { AccessLayoutSize } from "../components/AccessLayout";
import ModalLayout from "../components/ModalLayout";

const ForgotPasswordPage: FC = ({ location }) => {
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repeatError, setRepeatError] = useState("");
  const [success, setSuccess] = useState(false);

  const [updatePassword, { loading }] = useMutation(UPDATE_PASSWORD_MUTATION);

  const { token } = queryString.parse(location.search);

  const onSaveClick = async () => {
    if (!password) {
      setPasswordError("Debes introducir una contraseña");
      setRepeatError("");
      return;
    }
    if (password !== repeat) {
      setPasswordError("");
      setRepeatError("Las dos contraseñas no coinciden");
      return;
    }

    try {
      setPasswordError("");
      setRepeatError("");
      const result = await updatePassword({ variables: { token, newPassword: password } });
      setSuccess(true);
    } catch (e) {}
  };

  if (success) {
    return (
      <ModalLayout
        title="Contraseña cambiada"
        modalTitle="Contraseña cambiada"
        text={
          "Tu contraseña se ha cambiado con exito, a partir de ahora " + 
          "ya no podrás entrar con la anterior contraseña."
        }
        cancelText="Volver al inicio"
        onCancel={() => navigate("/")}
      />
    );
  }

  return (
    <AccessLayout
      title="Bitbloq | Nueva contraseña"
      panelTitle="Nueva contraseña"
      size={AccessLayoutSize.MEDIUM}
    >
      <Text>
        Escribe tu correo electrónico y te enviaremos un email con un enlace
        para que puedas crear una nueva contraseña.
      </Text>
      <FormGroup>
        <label>Nueva contraseña</label>
        <Input
          type="password"
          placeholder="Contraseña"
          value={password}
          error={passwordError}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
        {passwordError && (
          <ErrorMessage>{passwordError}</ErrorMessage>
        )}
      </FormGroup>
      <FormGroup>
        <label>Repetir nueva contraseña</label>
        <Input
          type="password"
          placeholder="Repetir contraseña"
          value={repeat}
          error={repeatError}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setRepeat(e.target.value)
          }
        />
        {repeatError && (
          <ErrorMessage>{repeatError}</ErrorMessage>
        )}
      </FormGroup>
      <Buttons>
        <Button secondary onClick={() => navigate("/login")}>
          Cancelar
        </Button>
        <Button onClick={() => onSaveClick()} disabled={loading}>
          Guardar
        </Button>
      </Buttons>
    </AccessLayout>
  );
};

export default ForgotPasswordPage;

const Text = styled.p`
  line-height: 1.57;
  margin-bottom: 40px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  label {
    display: block;
    margin-bottom: 10px;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 8px;
  font-size: 12px;
  font-style: italic;
  color: #d82b32;
`;

const Buttons = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
`;
