import React, { useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMutation, useApolloClient, ExecutionResult } from "react-apollo";
import { LOGIN_WITH_MICROSOFT } from "../apollo/queries";
import withApollo from "../apollo/withApollo";
import Loading from "../components/Loading";
import { signupSteps } from "../config";
import { setToken } from "../lib/session";
import { ISocialLogin } from "../../../api/src/api-types";

const MicrosoftRedirectPage: NextPage = () => {
  const client = useApolloClient();
  const router = useRouter();
  const [loginWithMicrosoft] = useMutation(LOGIN_WITH_MICROSOFT);

  const callLogin = async (
    token: string
  ): Promise<ExecutionResult<{ loginWithMicrosoft: ISocialLogin }>> =>
    loginWithMicrosoft({ variables: { token } }).catch(e => {
      throw e;
    });

  const onLeaveProcess = () => {
    router.push(sessionStorage.getItem("microsoftPrevPathname") || "/");
    sessionStorage.removeItem("microsoftPrevPathname");
  };

  const onLogin = (token: string) => {
    client.resetStore();
    setToken(token);
    router.push("/app");
  };

  const onSignup = (id: string) =>
    router.push(`/signup/${signupSteps.birthdate}?id=${id}`);

  useEffect(() => {
    try {
      const token = window.location.hash.split("#access_token=")[1].toString();
      (async () => {
        const { data } = await callLogin(token);
        data!.loginWithMicrosoft.finishedSignUp
          ? onLogin(data!.loginWithMicrosoft.token!)
          : onSignup(data!.loginWithMicrosoft.id!);
      })();
    } catch (e) {
      onLeaveProcess();
    }
  }, []);

  return <Loading />;
};

export default withApollo(MicrosoftRedirectPage, { requiresSession: false });
