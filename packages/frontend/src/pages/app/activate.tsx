import React, { FC } from "react";
import Activate from "../../components/Activate";
import withApollo from "../../apollo/withApollo";

const ActivatePage = ({ token }) => {
  return <Activate token={token} />;
};

ActivatePage.getInitialProps = async ({ query }) => {
  return {
    token: query.token
  };
};

export default withApollo(ActivatePage, { requiresSession: false });
