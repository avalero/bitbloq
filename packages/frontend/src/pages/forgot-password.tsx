import React, { FC, useState, useEffect } from "react";
import Router from "next/router";
import styled from "@emotion/styled";
import { useMutation } from "@apollo/react-hooks";
import { Input, Button, colors } from "@bitbloq/ui";
import withApollo from "../apollo/withApollo";
import { RESET_PASSWORD_MUTATION } from "../apollo/queries";
import AccessLayout, { AccessLayoutSize } from "../components/AccessLayout";
import CounterButton from "../components/CounterButton";
import ErrorMessage from "../components/ErrorMessage";
import ModalLayout from "../components/ModalLayout";

const ForgotPasswordPage: FC = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD_MUTATION);

  const onSendClick = async () => {
    try {
      setEmailError(false);
      const result = await resetPassword({ variables: { email } });
      setEmailSent(true);
    } catch (e) {
      setEmailError(true);
    }
  };

  if (emailSent) {
    return (
      <ModalLayout
        title="Bitbloq | Email enviado"
        modalTitle="Email enviado"
        text={
          "Revisa la bandeja de tu correo electrónico, si no se encuentra ahí," +
          " es posible que esté en la carpeta de Spam."
        }
        okButton={
          <CounterButton onClick={onSendClick}>
            Volver a enviar email
          </CounterButton>
        }
        cancelText="Volver al inicio"
        onCancel={() => Router.push("/")}
        isOpen={true}
      />
    );
  }

  return (
    <AccessLayout
      panelTitle="Contraseña olvidada"
      size={AccessLayoutSize.MEDIUM}
    >
      <Text>
        Escribe tu correo electrónico y te enviaremos un email con un enlace
        para que puedas crear una nueva contraseña.
      </Text>
      <FormGroup>
        <label>Correo electrónico</label>
        <Input
          name="email"
          type="text"
          placeholder="Correo electrónico"
          value={email}
          error={emailError}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
      </FormGroup>
      {emailError && (
        <ErrorMessage>
          No existe una cuenta de usuario asociada a este correo electrónico
        </ErrorMessage>
      )}
      <Buttons>
        <Button secondary onClick={() => Router.push("/login")}>
          Cancelar
        </Button>
        <Button onClick={() => onSendClick()} disabled={loading}>
          Enviar
        </Button>
      </Buttons>
    </AccessLayout>
  );
};

export default withApollo(ForgotPasswordPage, { requiresSession: false });

const Text = styled.p`
  color: ${colors.blackHover};
  line-height: 1.57;
  margin-bottom: 40px;
`;

const FormGroup = styled.div`
  margin-bottom: 8px;
  label {
    display: block;
    margin-bottom: 10px;
  }
`;

const Buttons = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
`;
