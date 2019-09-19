import fetch from "isomorphic-fetch";
import throttle from "lodash/throttle";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import { ApolloLink, Observable, split } from "apollo-link";
import { createUploadLink } from "apollo-upload-client";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { RENEW_TOKEN_MUTATION } from "./queries";
import {
  getToken,
  setToken,
  shouldRenewToken,
  onSessionError
} from "../lib/session";
import { flags } from "../config";

const { SHOW_GRAPHQL_LOGS } = flags;

const request = async (operation, client) => {
  const context = operation.getContext();

  let authHeader = "";

  if (context.email && context.password) {
    const basicAuth = btoa(`${context.email}:${context.password}`);
    authHeader = `Basic ${basicAuth}`;
  } else {
    let token = getToken(context.tempSession);
    if (
      token &&
      operation.operationName !== "RenewToken" &&
      shouldRenewToken(context.tempSession)
    ) {
      token = await renewToken(client, context.tempSession);
      if (token) {
        setToken(token);
      }
    }

    authHeader = `Bearer ${token}`;
  }

  operation.setContext({
    headers: {
      Authorization: authHeader
    }
  });
};

const renewToken = async (client, tempSession) => {
  try {
    const { data, error } = await client.mutate({
      mutation: RENEW_TOKEN_MUTATION,
      context: { tempSession }
    });
    return data.renewToken;
  } catch (e) {
    if (SHOW_GRAPHQL_LOGS) {
      console.log("Renew token error", e);
    }
    return "";
  }
};

const httpLink = createUploadLink({
  uri: "/api/graphql",
  fetch
});

export const createClient = isBrowser => {
  const client = new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError, operation }) => {
        const context = operation.getContext();
        if (graphQLErrors) {
          const authError = graphQLErrors.find(
            ({ path, extensions }) =>
              extensions && extensions.code === "UNAUTHENTICATED"
          );

          if (authError) {
            onSessionError(authError);
          }

          if (SHOW_GRAPHQL_LOGS) {
            graphQLErrors.map(({ message, locations, path }) =>
              console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
              )
            );
          }
        }
        if (networkError && SHOW_GRAPHQL_LOGS)
          console.log(`[Network error]: ${JSON.stringify(networkError)}`);
      }),
      new ApolloLink(
        (operation, forward) =>
          new Observable(observer => {
            let handle;
            Promise.resolve(operation)
              .then(oper => request(oper, client))
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
      ),
      isBrowser
        ? split(
            ({ query }) => {
              const { kind, operation } = getMainDefinition(query);
              return (
                kind === "OperationDefinition" && operation === "subscription"
              );
            },
            new WebSocketLink({
              uri: `${window.location.protocol === "https:" ? "wss" : "ws"}://${
                window.location.host
              }/api/graphql`,
              options: {
                lazy: true,
                reconnect: true,
                connectionParams: async () => {
                  const token = getToken();

                  return {
                    authorization: token ? `Bearer ${token}` : ""
                  };
                }
              }
            }),
            httpLink
          )
        : httpLink
    ]),
    cache: new InMemoryCache()
  });

  return client;
};
