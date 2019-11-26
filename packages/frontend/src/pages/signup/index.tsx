import redirect from "../../lib/redirect";
import withApollo from "../../apollo/withApollo";

const SignupPage = () => {
  return null;
};

SignupPage.getInitialProps = async ctx => {
  redirect(ctx, "/signup/user-data");
  return {};
};

export default withApollo(SignupPage, { requiresSession: false });
