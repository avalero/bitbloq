import React, {
  FC,
  createContext,
  useContext,
  useState,
  useEffect
} from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { ME_QUERY } from "../apollo/queries";
import Loading from "../components/Loading";
import { useSessionEvent } from "../lib/session";

export const UserDataContext = createContext<any>(null);

interface IUserDataProvider {
  initialUserData: any;
  requiresSession: boolean;
  onChange: (user: any) => any;
}
export const UserDataProvider: FC<IUserDataProvider> = ({
  initialUserData,
  requiresSession,
  onChange,
  children
}) => {
  const [userData, setUserData] = useState(initialUserData);
  const client = useApolloClient();

  useEffect(() => {
    onChange(userData);
  }, [userData]);

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

  if (!userData && requiresSession) {
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
