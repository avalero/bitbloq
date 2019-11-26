import { NextPage } from "next";
import React from "react";
import withApollo from "../../apollo/withApollo";
import Activate from "../../components/Activate";

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
