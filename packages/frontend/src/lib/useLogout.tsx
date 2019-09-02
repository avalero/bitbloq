import { useApolloClient } from "@apollo/react-hooks";
import { navigate } from "gatsby";

const useLogout = () => {
  const client = useApolloClient();
  return () => {
    localStorage.setItem("authToken", "");
    client.resetStore();
    navigate("/");
  };
};

export default useLogout;
