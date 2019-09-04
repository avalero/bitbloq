import React, {FC} from "react";
import { navigate } from "gatsby";
import AccessLayout from "../components/AccessLayout";

const LoginPage: FC = () => {

  const onLogin = (token: string) => {
    window.sessionStorage.setItem("authToken", "");
    window.localStorage.setItem("authToken", token);
    navigate("/app");
  };

  return (
    <AccessLayout title="Bitbloq - Login" />
  );
};

export default LoginPage;
