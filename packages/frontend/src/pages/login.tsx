import React, { FC, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { navigate } from "gatsby";
import AccessLayout from "../components/AccessLayout";
import BrowserVersionWarning from "../components/BrowserVersionWarning";
import LoginPanel from "../components/LoginPanel";
import { LOGIN_MUTATION } from "../apollo/queries";
import { setToken } from "../lib/session";
import { getChromeVersion } from "../util";

const LoginPage: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logingError, setLogingError] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [login] = useMutation(LOGIN_MUTATION);

  if (getChromeVersion() < 69) {
    return <BrowserVersionWarning version={69} />;
  }

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
        secondaryButtonCallback={() => navigate("/signup")}
        secondaryButtonText="Crear una cuenta"
        setEmail={setEmail}
        setPassword={setPassword}
      />
    </AccessLayout>
  );
};

export default LoginPage;
