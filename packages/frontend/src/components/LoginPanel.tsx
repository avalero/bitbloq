import React, { FC } from "react";
import styled from "@emotion/styled";
import { Link } from "gatsby";
import { Input, Button } from "@bitbloq/ui";

interface FormProps {
  className?: string;
  email: string;
  logingError: boolean;
  password: string;
  setEmail(email: string): void;
  setPassword(password: string): void;
}

export const LoginForm: FC<FormProps> = ({
  className,
  email,
  logingError,
  password,
  setEmail,
  setPassword
}) => {
  return (
    <div className={className}>
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
    </div>
  );
};

interface LoginPanelProps {
  className?: string;
  email: string;
  logingError: boolean;
  logingIn: boolean;
  password: string;
  onLoginClick(): void;
  secondaryButtonCallback(): void;
  secondaryButtonText: string;
  setEmail(email: string): void;
  setPassword(password: string): void;
}

const LoginPanel: FC<LoginPanelProps> = (props: LoginPanelProps) => {
  const {
    className,
    email,
    logingError,
    logingIn,
    password,
    onLoginClick,
    secondaryButtonCallback,
    secondaryButtonText,
    setEmail,
    setPassword
  } = props;
  return (
    <Panel
      className={className}
      onSubmit={(event: Event) => event.preventDefault()}
    >
      <LoginForm
        email={email}
        logingError={logingError}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
      />
      <Button type="submit" onClick={() => onLoginClick()} disabled={logingIn}>
        Entrar
      </Button>
      <Button secondary onClick={secondaryButtonCallback}>
        {secondaryButtonText}
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
  font-family: Roboto;

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
