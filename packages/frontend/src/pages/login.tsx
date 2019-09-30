import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import { useMutation } from "@apollo/react-hooks";
import { navigate, Link } from "gatsby";
import { Input, Button } from "@bitbloq/ui";
import AccessLayout from "../components/AccessLayout";
import { LOGIN_MUTATION } from "../apollo/queries";
import { setToken } from "../lib/session";

const LoginPage: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logingError, setLogingError] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [login] = useMutation(LOGIN_MUTATION);

  const onLoginClick = async () => {
    try {
      setLoggingIn(true);
      setLogingError(false);
      const result = await login({ variables: { email, password } });
      setLoggingIn(false);
      onLoginSuccess(result.data.login);
    } catch (e) {
      setLoggingIn(false);
      setLogingError(true);
    }
  };

  const onLoginSuccess = (token: string) => {
    setToken(token);
    navigate("/app");
  };

  return (
    <AccessLayout title="Bitbloq - Login" panelTitle="Entrar">
      <LoginPanel onSubmit={(event: Event) => event.preventDefault()}>
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
          <ErrorMessage>
            Correo electrónico o contraseña no válidos
          </ErrorMessage>
        )}
        <Button type="submit" onClick={() => onLoginClick()} disabled={loggingIn}>
          Entrar
        </Button>
        <Button secondary onClick={() => navigate("/signup")}>
          Crear una cuenta
        </Button>
        <Link to="/forgot-password">No recuerdo mi contraseña</Link>
      </LoginPanel>
    </AccessLayout>
  );
};

export default LoginPage;

const LoginPanel = styled.form`
  button {
    width: 100%;
    margin-bottom: 10px;
  }

  a {
    font-size: 14px;
    font-weight: bold;
    font-style: italic;
    color: #00ade5;
    text-align: center;
    display: block;
    text-decoration: none;
    margin-top: 4px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  label {
    display: block;
    margin-bottom: 10px;
  }
`;

const ErrorMessage = styled.div`
  font-size: 12px;
  font-style: italic;
  color: #d82b32;
  margin-bottom: 30px;
`;
