import { NextPage, NextPageContext } from "next";
import withApollo from "../../apollo/withApollo";
import { signupSteps } from "../../config";
import redirect from "../../lib/redirect";

const SignupPage: NextPage = () => {
  return null;
};

SignupPage.getInitialProps = async (ctx: NextPageContext) => {
  const {
    query: { plan }
  } = ctx;
  const url = `/signup/${signupSteps.userData}` + (plan ? `?plan=${plan}` : "");
  redirect(ctx, url);
  return {};
};

export default withApollo(SignupPage, { requiresSession: false });
