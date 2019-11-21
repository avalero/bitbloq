import React, { useEffect } from "react";
import { NextPage } from "next";
import { useMutation } from "react-apollo";
import { LOGIN_WITH_GOOGLE } from "../apollo/queries";
import withApollo from "../apollo/withApollo";
import Loading from "../components/Loading";

const GoogleRedirectPage: NextPage = () => {
  const [loginWithGoogle] = useMutation(LOGIN_WITH_GOOGLE);

  const callLogin = async token => {
    const { data } = await loginWithGoogle({ variables: { token } });
    console.log("DATA", data);
  };
  useEffect(() => {
    const token = window.location.hash.split("#access_token=")[1];
    callLogin(token);
  }, []);

  return <Loading />;
};

export default withApollo(GoogleRedirectPage, { requiresSession: false });
