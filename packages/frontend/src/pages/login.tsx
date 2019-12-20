import React, { FC, useState } from "react";
import Router from "next/router";
import { useMutation, useApolloClient } from "@apollo/react-hooks";
import { useTranslate } from "@bitbloq/ui";
import withApollo from "../apollo/withApollo";
import AccessLayout from "../components/AccessLayout";
import LoginPanel from "../components/LoginPanel";
import { LOGIN_MUTATION } from "../apollo/queries";
import { setToken } from "../lib/session";
import { ILogin } from "../types";

const LoginPage: FC = () => {
  const t = useTranslate();
  const [loginError, setLoginError] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [login] = useMutation(LOGIN_MUTATION);
  const client = useApolloClient();

  const onLogin = async (input: ILogin) => {
    try {
      setLoggingIn(true);
      setLoginError(false);
      const result = await login({
        variables: { email: input.email, password: input.password }
      });
      onLoginSuccess(result.data.login);
    } catch (e) {
      setLoggingIn(false);
      setLoginError(true);
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
        loggingIn={loggingIn}
        loginError={loginError}
        onLogin={onLogin}
        onSecondaryButton={() => Router.push("/signup")}
        secondaryButtonText={t("login.signup")}
      />
    </AccessLayout>
  );
};

export default withApollo(LoginPage, { requiresSession: false });
