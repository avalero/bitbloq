import { NextPage, NextPageContext } from "next";
import withApollo from "../../apollo/withApollo";
import { signupSteps } from "../../config";
import redirect from "../../lib/redirect";

const SignupPage: NextPage = () => {
  return null;
};

SignupPage.getInitialProps = async (ctx: NextPageContext) => {
  redirect(ctx, `/signup/${signupSteps.userData}`);
  return {};
};

export default withApollo(SignupPage, { requiresSession: false });
