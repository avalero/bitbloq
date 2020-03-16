import React, { useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMutation, useApolloClient, ExecutionResult } from "react-apollo";
import { ISocialLogin } from "@bitbloq/api";
import { LOGIN_WITH_MICROSOFT } from "../apollo/queries";
import withApollo from "../apollo/withApollo";
import Loading from "../components/Loading";
import { signupSteps, microsoftScopes } from "../config";
import { setToken } from "../lib/session";
import post from "axios";
import { stringify } from "query-string";

const MicrosoftRedirectPage: NextPage = () => {
  const client = useApolloClient();
  const router = useRouter();
  const [loginWithMicrosoft] = useMutation(LOGIN_WITH_MICROSOFT);

  const callLogin = async (
    token: string
  ): Promise<ExecutionResult<{ loginWithMicrosoft: ISocialLogin }>> =>
    loginWithMicrosoft({ variables: { token } }).catch(e => {
      // router.push("/app");
      console.log("ERROR AQUI");
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
    router.push(`/signup/${signupSteps.birthDate}?id=${id}`);

  useEffect(() => {
    try {
      console.log(window.location);
      const url: string =
        window.location && window.location.href && window.location.href;
      const code = url
        .split("?code=")[1]
        .toString()
        .split("&")[0]
        .toString();
      console.log(code);
      // const token = window.location.hash.split("&id_token=")[1].toString();
      // const token1 = token.split("&state=")[0].toString();
      (async () => {
        const location = window.location;
        const redirect: string = `${location.protocol}//${location.host}/microsoft-redirect/`;
        console.log(redirect);

        const { data } = await callLogin(code);
        console.log({ data });
        data!.loginWithMicrosoft.finishedSignUp
          ? onLogin(data!.loginWithMicrosoft.token!)
          : onSignup(data!.loginWithMicrosoft.id!);
      })();
    } catch (e) {
      console.log(e);
      // onLeaveProcess();
    }
  }, []);

  return <Loading />;
};

export default withApollo(MicrosoftRedirectPage, { requiresSession: false });
