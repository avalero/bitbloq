import React, { FC, createContext, useContext, useState } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { ME_QUERY } from "../apollo/queries";
import Loading from "../components/Loading";
import { useSessionEvent } from "../lib/session";

export const UserDataContext = createContext<any>(null);

export const UserDataProvider = ({ initialUserData, children }) => {
  const [userData, setUserData] = useState(initialUserData);
  const client = useApolloClient();
  useSessionEvent("new-token", async event => {
    const token = event.data;
    if (!token) {
      setUserData(null);
    } else if (!userData) {
      const { data } = await client.query({
        query: ME_QUERY,
        fetchPolicy: "network-only"
      });
      setUserData(data && data.me);
    }
  });

  return (
    <UserDataContext.Provider value={userData}>
      {children}
    </UserDataContext.Provider>
  );
};

const useUserData = () => useContext(UserDataContext);

export default useUserData;
