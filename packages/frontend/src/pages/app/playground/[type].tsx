import { NextPage } from "next";
import redirect from "../../../lib/redirect";

const PlaygroundPage: NextPage = () => {
  return null;
};

PlaygroundPage.getInitialProps = async ctx => {
  const { query } = ctx;
  redirect(ctx, `/app/edit-document/local/${query.type}/new`);
  return {};
};

export default PlaygroundPage;
