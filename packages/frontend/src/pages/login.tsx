import React, { FC } from "react";
import Router from "next/router";
import { useApolloClient } from "@apollo/react-hooks";
import { useTranslate } from "@bitbloq/ui";
import withApollo from "../apollo/withApollo";
import AccessLayout from "../components/AccessLayout";
import LoginPanel from "../components/LoginPanel";
import { setToken } from "../lib/session";

const LoginPage: FC = () => {
  const t = useTranslate();
  const client = useApolloClient();

  const onLoginSuccess = (token: string) => {
    client.resetStore();
    setToken(token);
    Router.push("/app");
  };

  return (
    <AccessLayout panelTitle={t("login.title")}>
      <LoginPanel
        onLoginSuccess={onLoginSuccess}
        onSecondaryButton={() => Router.push("/signup")}
        secondaryButtonText={t("login.signup")}
      />
    </AccessLayout>
  );
};

export default withApollo(LoginPage, { requiresSession: false });
