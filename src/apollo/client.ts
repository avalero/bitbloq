import fetch from "isomorphic-fetch";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import { ApolloLink, Observable, split } from "apollo-link";
import { createUploadLink } from "apollo-upload-client";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

const request = async operation => {
  const token =
    window.sessionStorage.getItem("authToken") ||
    window.localStorage.getItem("authToken");

  operation.setContext({
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable(observer => {
      let handle;
      Promise.resolve(operation)
        .then(oper => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer)
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

const httpLink = createUploadLink({
  uri: "/api/graphql",
  fetch
});

export const createClient = isBrowser =>
  new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.map(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        if (networkError) console.log(`[Network error]: ${JSON.stringify(networkError)}`);
      }),
      requestLink,
      isBrowser
        ? split(
            ({ query }) => {
              const { kind, operation } = getMainDefinition(query);
              return (
                kind === "OperationDefinition" && operation === "subscription"
              );
            },
            new WebSocketLink({
              uri: `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/api/graphql`, 
              options: {
                lazy: true,
                reconnect: true,
                connectionParams: async () => {
                  const token =
                    window.sessionStorage.getItem("authToken") ||
                    window.localStorage.getItem("authToken");

                  return {
                    authorization: token ? `Bearer ${token}` : ""
                  };
                }
              },
            }),
            httpLink
          )
        : httpLink
    ]),
    cache: new InMemoryCache()
  });
