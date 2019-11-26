import React, { FC, useState } from "react";
import Router from "next/router";
import { useMutation, useApolloClient } from "@apollo/react-hooks";
import { useTranslate } from "@bitbloq/ui";
import withApollo from "../apollo/withApollo";
import AccessLayout from "../components/AccessLayout";
import LoginPanel from "../components/LoginPanel";
import { LOGIN_MUTATION } from "../apollo/queries";
import { setToken } from "../lib/session";

const LoginPage: FC = () => {
  const t = useTranslate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLogingError] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [login] = useMutation(LOGIN_MUTATION);
  const client = useApolloClient();

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
    client.resetStore();
    setToken(token);
    Router.push("/app");
  };

  return (
    <AccessLayout panelTitle={t("login.title")}>
      <LoginPanel
        email={email}
        loginError={loginError}
        loginIn={loggingIn}
        password={password}
        onLoginClick={onLoginClick}
        secondaryButtonCallback={() => Router.push("/signup")}
        secondaryButtonText={t("login.signup")}
        setEmail={setEmail}
        setPassword={setPassword}
      />
    </AccessLayout>
  );
};

export default withApollo(LoginPage, { requiresSession: false });
