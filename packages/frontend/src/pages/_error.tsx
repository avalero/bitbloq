import { NextPage } from "next";
import ErrorLayout from "../components/ErrorLayout";
import { useTranslate } from "@bitbloq/ui";

interface IErrorProps {
  statusCode?: number;
}

const Error: NextPage<IErrorProps> = ({ statusCode }) => {
  const t = useTranslate();
  let text = "";
  if (statusCode === 403) {
    text = t("page-error-text.403");
  }
  if (statusCode === 404) {
    text = t("page-error-text.404");
  }
  if (statusCode === 500) {
    text = t("page-error-text.500");
  }

  return <ErrorLayout code={(statusCode || "").toString()} text={text} />;
};

Error.getInitialProps = async ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
