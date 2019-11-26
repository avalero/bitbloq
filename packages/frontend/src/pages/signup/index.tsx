import _ from "lodash";
import withApollo from "../../apollo/withApollo";
import { signupSteps } from "../../config";
import redirect from "../../lib/redirect";

const SignupPage = () => {
  return null;
};

SignupPage.getInitialProps = async ctx => {
  redirect(ctx, `/signup/${_.first(signupSteps)}`);
  return {};
};

export default withApollo(SignupPage, { requiresSession: false });
