import React, { FC } from "react";
import styled from "@emotion/styled";
import { navigate, Link } from "gatsby";
import { Input, Button } from "@bitbloq/ui";

interface LoginPanelProps {
  email: string;
  logingError: boolean;
  logingIn: boolean;
  password: string;
  onLoginClick(): void;
  setEmail(email: string): void;
  setPassword(password: string): void;
}

const LoginPanel: FC<LoginPanelProps> = (props: LoginPanelProps) => {
  const {
    email,
    logingError,
    logingIn,
    password,
    onLoginClick,
    setEmail,
    setPassword
  } = props;
  return (
    <Panel onSubmit={(event: Event) => event.preventDefault()}>
      <FormGroup>
        <label>Correo electrónico</label>
        <Input
          name="email"
          type="text"
          placeholder="Correo electrónico"
          value={email}
          error={logingError}
          onChange={e => setEmail(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <label>Contraseña</label>
        <Input
          name="email"
          type="password"
          placeholder="Contraseña"
          value={password}
          error={logingError}
          onChange={e => setPassword(e.target.value)}
        />
      </FormGroup>
      {logingError && (
        <ErrorMessage>Correo electrónico o contraseña no válidos</ErrorMessage>
      )}
      <Button type="submit" onClick={() => onLoginClick()} disabled={logingIn}>
        Entrar
      </Button>
      <Button secondary onClick={() => navigate("/signup")}>
        Crear una cuenta
      </Button>
      <Link to="/forgot-password">No recuerdo mi contraseña</Link>
    </Panel>
  );
};

export default LoginPanel;

const ErrorMessage = styled.div`
  color: #d82b32;
  font-size: 12px;
  font-style: italic;
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  label {
    display: block;
    margin-bottom: 10px;
  }
`;

const Panel = styled.form`
  a {
    color: #00ade5;
    display: block;
    font-size: 14px;
    font-style: italic;
    font-weight: bold;
    margin-top: 4px;
    text-align: center;
    text-decoration: none;
  }

  button {
    margin-bottom: 10px;
    width: 100%;
  }
`;
