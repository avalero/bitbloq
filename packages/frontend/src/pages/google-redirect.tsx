import React, { useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMutation, useApolloClient, ExecutionResult } from "react-apollo";
import { LOGIN_WITH_GOOGLE } from "../apollo/queries";
import withApollo from "../apollo/withApollo";
import Loading from "../components/Loading";
import { signupSteps } from "../config";
import { setToken } from "../lib/session";
import { IMsLogin } from "../../../api/src/api-types";

const GoogleRedirectPage: NextPage = () => {
  const client = useApolloClient();
  const router = useRouter();
  const [loginWithGoogle] = useMutation(LOGIN_WITH_GOOGLE);

  const callLogin = async (
    token: string
  ): Promise<ExecutionResult<{ loginWithGoogle: IMsLogin }>> =>
    loginWithGoogle({ variables: { token } });

  const onLogin = (token: string) => {
    client.resetStore();
    setToken(token);
    router.push("/app");
  };

  const onPlanSelection = (id: string) =>
    router.push(`/signup/${signupSteps[1]}?id=${id}`);

  const onLeaveProcess = () => {
    router.push(sessionStorage.getItem("googlePrevPathname") || "/");
    sessionStorage.removeItem("googlePrevPathname");
  };

  useEffect(() => {
    try {
      const token1 = window.location.href.split("&access_token=")[1];
      const token = token1.split("&token_type=")[0];
      (async () => {
        const { data } = await callLogin(token);
        data!.loginWithGoogle.finishedSignUp
          ? onLogin(data!.loginWithGoogle.token!)
          : onPlanSelection(data!.loginWithGoogle.id!);
      })();
    } catch (e) {
      onLeaveProcess();
    }
  }, []);

  return <Loading />;
};

export default withApollo(GoogleRedirectPage, { requiresSession: false });
