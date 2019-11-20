import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import withApollo from "../apollo/withApollo";

const SignupPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/signup/user-data");
  }, []);

  return null;
};

export default withApollo(SignupPage, { requiresSession: false });
