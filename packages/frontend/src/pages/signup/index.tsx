import _ from "lodash";
import { NextPage, NextPageContext } from "next";
import withApollo from "../../apollo/withApollo";
import { signupSteps } from "../../config";
import redirect from "../../lib/redirect";

const SignupPage: NextPage = () => {
  return null;
};

SignupPage.getInitialProps = async (ctx: NextPageContext) => {
  redirect(ctx, `/signup/${_.first(signupSteps)}`);
  return {};
};

export default withApollo(SignupPage, { requiresSession: false });
