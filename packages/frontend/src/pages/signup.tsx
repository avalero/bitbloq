import redirect from "../lib/redirect";

const SignupPage = () => {
  return null;
};

SignupPage.getInitialProps = async ctx => {
  redirect(ctx, "/signup/user-data");
  return {};
};

export default SignupPage;
