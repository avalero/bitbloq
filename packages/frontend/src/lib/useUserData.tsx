import React, { FC, createContext, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { ME_QUERY } from "../apollo/queries";
import useLogout from "./useLogout";
import Loading from "../components/Loading";

const UserDataContext = createContext<any>(null);

export interface UserDataProviderProps {
  authRequired?: boolean;
}

export const UserDataProvider: FC<UserDataProviderProps> = ({
  children,
  authRequired
}) => {
  const { data, loading, error } = useQuery(ME_QUERY, {
    context: {
      disableAuthRedirect: true
    }
  });

  const logout = useLogout();

  if (loading) {
    return <Loading />;
  }

  if (error && authRequired) {
    logout();
    return null;
  }

  return (
    <UserDataContext.Provider value={data && data.me}>
      {children}
    </UserDataContext.Provider>
  );
};

const useUserData = () => useContext(UserDataContext);

export default useUserData;
