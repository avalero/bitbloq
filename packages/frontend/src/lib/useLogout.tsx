import { useApolloClient } from "@apollo/react-hooks";
import { setToken } from "./session";

const useLogout = () => {
  const client = useApolloClient();
  return (resetToken: boolean = true) => {
    if (resetToken) {
      setToken("");
    }
    client.resetStore();
    window.location.assign("/");
  };
};

export default useLogout;
