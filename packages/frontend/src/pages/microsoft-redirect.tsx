import React, { useEffect } from "react";
import { NextPage } from "next";
import { useMutation } from "react-apollo";
import { LOGIN_WITH_MICROSOFT } from "../apollo/queries";
import withApollo from "../apollo/withApollo";
import Loading from "../components/Loading";

const MicrosoftRedirectPage: NextPage = () => {
  const [loginWithMicrosoft] = useMutation(LOGIN_WITH_MICROSOFT);

  const callLogin = async token => {
    const { data } = await loginWithMicrosoft({ variables: { token } });
    console.log("DATA", data);
  };
  useEffect(() => {
    const token = window.location.hash.split("#access_token=")[1];
    callLogin(token);
  }, []);

  return <Loading />;
};

export default withApollo(MicrosoftRedirectPage, { requiresSession: false });
