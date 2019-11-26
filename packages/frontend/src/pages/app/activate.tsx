import React from "react";
import Activate from "../../components/Activate";
import withApollo from "../../apollo/withApollo";
import { NextPage } from "next";

interface IActivatePageProps {
  token: string;
}

const ActivatePage: NextPage<IActivatePageProps> = ({ token }) => {
  return <Activate token={token} />;
};

ActivatePage.getInitialProps = async ({ query }) => {
  return {
    token: query.token.toString()
  };
};

export default withApollo(ActivatePage, { requiresSession: false });
