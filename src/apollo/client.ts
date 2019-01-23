import ApolloClient from "apollo-boost";
import fetch from "isomorphic-fetch";

export const client = new ApolloClient({
  uri: "/api/graphql",
  request: async operation => {
    const token =
      window.sessionStorage.getItem("authToken") ||
      window.localStorage.getItem("authToken");
    operation.setContext({
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  fetch
});
