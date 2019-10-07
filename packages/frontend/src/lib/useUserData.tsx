import React, { FC, createContext, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { ME_QUERY } from "../apollo/queries";
import Loading from "../components/Loading";

export const UserDataContext = createContext<any>(null);

export const UserDataProvider: FC = ({ children }) => {
  const { data, loading } = useQuery(ME_QUERY);

  if (loading) {
    return <Loading />;
  }

  return (
    <UserDataContext.Provider value={data && data.me}>
      {children}
    </UserDataContext.Provider>
  );
};

const useUserData = () => useContext(UserDataContext);

export default useUserData;
