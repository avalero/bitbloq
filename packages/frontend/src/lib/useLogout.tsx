import { useApolloClient } from "@apollo/react-hooks";
import { navigate } from "gatsby";
import { setToken } from "./session";

const useLogout = () => {
  const client = useApolloClient();
  return () => {
    setToken("");
    client.resetStore();
    navigate("/");
  };
};

export default useLogout;
