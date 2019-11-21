import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import withApollo from "../apollo/withApollo";
import Loading from "../components/Loading";

const SignupPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/signup/user-data");
  });

  return <Loading />;
};

export default withApollo(SignupPage, { requiresSession: false });
