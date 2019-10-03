import React, { FC, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { navigate } from "gatsby";
import AccessLayout from "../components/AccessLayout";
import LoginPanel from "../components/LoginPanel";
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
      <LoginPanel
        email={email}
        logingError={logingError}
        logingIn={loggingIn}
        password={password}
        onLoginClick={onLoginClick}
        setEmail={setEmail}
        setPassword={setPassword}
      />
    </AccessLayout>
  );
};

export default LoginPage;
