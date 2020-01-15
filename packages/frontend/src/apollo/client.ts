import fetch from "isomorphic-fetch";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import { ApolloLink, Observable, split } from "apollo-link";
import { createUploadLink } from "apollo-upload-client";
import { WebSocketLink } from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { getMainDefinition } from "apollo-utilities";
import { flags } from "../config";
import env from "../lib/env";

const { SHOW_GRAPHQL_LOGS } = flags;

const request = async (operation, client, { getToken }) => {
  const context = operation.getContext();

  let authHeader = "";

  if (context.email && context.password) {
    const basicAuth = btoa(`${context.email}:${context.password}`);
    authHeader = `Basic ${basicAuth}`;
  } else {
    const token = context.token || getToken();
    authHeader = `Bearer ${token}`;
  }

  operation.setContext({
    headers: {
      Authorization: authHeader
    }
  });
};

const isBrowser = typeof window !== "undefined";

const httpLink = createUploadLink({
  fetch,
  uri: isBrowser ? env.API_URL : env.API_URL_SERVER || env.API_URL
});

export const createClient = (initialState, { getToken, onSessionError }) => {
  const createWsLink = () => {
    const subscriptionClient = new SubscriptionClient(
      `${env.API_URL!.replace("http", "ws")}`,
      {
        lazy: true,
        reconnect: true,
        connectionParams: async () => {
          const token = getToken();
          return {
            authorization: token ? `Bearer ${token}` : ""
          };
        }
      }
    );

    const subscriptionMiddleware = {
      applyMiddleware(options, next) {
        const token = getToken();
        options.authorization = token ? `Bearer ${token}` : "";
        next();
      }
    };

    subscriptionClient.use([subscriptionMiddleware]);

    return new WebSocketLink(subscriptionClient);
  };

  const client = new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError, operation }) => {
        const context = operation.getContext();
        if (graphQLErrors) {
          const authError = graphQLErrors.find(
            ({ path, extensions }) =>
              extensions &&
              (extensions.code === "UNAUTHENTICATED" ||
                extensions.code === "ANOTHER_OPEN_SESSION")
          );

          if (authError) {
            onSessionError(authError);
          }

          if (SHOW_GRAPHQL_LOGS) {
            graphQLErrors.map(({ message, locations, path }) =>
              console.error(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
              )
            );
          }
        }
        if (networkError && SHOW_GRAPHQL_LOGS) {
          console.error(`[Network error]: ${JSON.stringify(networkError)}`);
        }
      }),
      new ApolloLink(
        (operation, forward) =>
          new Observable(observer => {
            let handle;
            Promise.resolve(operation)
              .then(oper =>
                request(oper, client, {
                  getToken
                })
              )
              .then(() => {
                handle = forward(operation).subscribe({
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer)
                });
              })
              .catch(observer.error.bind(observer));

            return () => {
              if (handle) {
                handle.unsubscribe();
              }
            };
          })
      ),
      isBrowser
        ? split(
            ({ query }) => {
              const definition = getMainDefinition(query);
              return (
                definition.kind === "OperationDefinition" &&
                definition.operation === "subscription"
              );
            },
            createWsLink(),
            httpLink
          )
        : httpLink
    ]),
    cache: new InMemoryCache().restore(initialState)
  });

  return client;
};
