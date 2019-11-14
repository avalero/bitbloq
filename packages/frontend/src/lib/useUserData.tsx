import React, { FC, createContext, useContext, useState } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { ME_QUERY } from "../apollo/queries";
import Loading from "../components/Loading";
import { useSessionEvent } from "../lib/session";
import useLogout from "../lib/useLogout";

export const UserDataContext = createContext<any>(null);

interface IUserDataProvider {
  initialUserData: any;
  requiresSession: boolean;
}
export const UserDataProvider: FC<IUserDataProvider> = ({
  initialUserData,
  requiresSession,
  children
}) => {
  const logout = useLogout();
  const [userData, setUserData] = useState(initialUserData);
  const [sessionExpired, setSessionExpired] = useState(false);
  const client = useApolloClient();

  useSessionEvent("new-token", async event => {
    const token = event.data;
    if (!token) {
      setUserData(null);
      if (userData) {
        setSessionExpired(true);
      }
    } else if (!userData) {
      const { data } = await client.query({
        query: ME_QUERY,
        fetchPolicy: "network-only"
      });
      setUserData(data && data.me);
    }
  });

  if ((!userData && requiresSession) || sessionExpired) {
    logout();
    return null;
  }

  return (
    <UserDataContext.Provider value={userData}>
      {children}
    </UserDataContext.Provider>
  );
};

const useUserData = () => useContext(UserDataContext);

export default useUserData;
