import { useApolloClient } from "@apollo/react-hooks";
import Router from "next/router";
import { setToken } from "./session";

const useLogout = () => {
  const client = useApolloClient();
  return async (resetToken: boolean = true) => {
    if (resetToken) {
      setToken("");
    }
    await client.resetStore();
    Router.push("/");
  };
};

export default useLogout;
