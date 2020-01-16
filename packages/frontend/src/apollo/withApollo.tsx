import React, { FC, useEffect, useState } from "react";
import Router from "next/router";
import { NextApiRequest, NextPageContext } from "next";
import Head from "next/head";
import { ApolloClient, ApolloError } from "apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";
import { createClient } from "./client";
import { ME_QUERY, USER_SESSION_EXPIRES_SUBSCRIPTION } from "./queries";
import {
  getToken,
  setToken,
  onSessionError,
  logout,
  useSessionEvent
} from "../lib/session";
import { UserDataProvider } from "../lib/useUserData";
import redirect from "../lib/redirect";
import SessionWarningModal from "../components/SessionWarningModal";
import ErrorLayout from "../components/ErrorLayout";

export interface IContext extends NextPageContext {
  apolloClient: ApolloClient<any>;
}

interface ISessionWatcherProps {
  tempSession?: string;
  client: ApolloClient<any>;
  userDataError: ApolloError;
}

const SessionWatcher: FC<ISessionWatcherProps> = ({
  tempSession,
  client,
  userDataError
}) => {
  const [anotherSession, setAnotherSession] = useState(false);

  const handleError = (error: any) => {
    const code = error && error.extensions && error.extensions.code;
    if (code === "ANOTHER_OPEN_SESSION") {
      setAnotherSession(true);
      setToken("");
    }
    if (code === "UNAUTHENTICATED") {
      Router.replace("/");
    }
  };

  useEffect(() => {
    if (userDataError) {
      if (userDataError.networkError) {
        const networkError = userDataError.networkError as any;
        const errors = networkError.result && networkError.result.errors;
        if (errors && errors.length) {
          errors.forEach(handleError);
        }
      }
    }
  }, []);

  useSessionEvent("error", ({ error }) => handleError(error), tempSession);

  useSessionEvent("logout", async () => {
    setToken("");
    if (client) {
      await client.cache.reset();
      await client.reFetchObservableQueries();
    }
    Router.replace("/");
  });

  if (anotherSession) {
    return (
      <ErrorLayout
        title="Has iniciado sesión en otro dispositivo"
        text="Solo se puede tener una sesión abierta al mismo tiempo"
        onOk={() => logout()}
      />
    );
  }
  return tempSession ? null : (
    <SessionWarningModal subscription={USER_SESSION_EXPIRES_SUBSCRIPTION} />
  );
};

export default function withApollo(
  PageComponent,
  {
    ssr = true,
    tempSession = "",
    requiresSession = true,
    onlyWithoutSession = false
  } = {}
) {
  const WithApollo = ({
    apolloClient,
    apolloState,
    userData,
    userDataError,
    ...pageProps
  }) => {
    const client = apolloClient || initApolloClient(apolloState, tempSession);

    const onChangeUserData = user => {
      if (user && onlyWithoutSession) {
        redirect({}, "/app");
      }
    };

    return (
      <ApolloProvider client={client}>
        {tempSession ? (
          <PageComponent {...pageProps} />
        ) : (
          <UserDataProvider
            initialUserData={userData}
            requiresSession={requiresSession}
            onChange={onChangeUserData}
          >
            <PageComponent {...pageProps} />
          </UserDataProvider>
        )}
        <SessionWatcher
          tempSession={tempSession}
          client={client}
          userDataError={userDataError}
        />
      </ApolloProvider>
    );
  };

  if (process.env.NODE_ENV !== "production") {
    const displayName =
      PageComponent.displayName || PageComponent.name || "Component";
    WithApollo.displayName = `withApollo(${displayName})`;
  }

  if (ssr || PageComponent.getInitialProps) {
    WithApollo.getInitialProps = async ctx => {
      const { AppTree } = ctx;

      const apolloClient = (ctx.apolloClient = initApolloClient(
        {},
        tempSession,
        ctx.req
      ));

      const pageProps = PageComponent.getInitialProps
        ? await PageComponent.getInitialProps(ctx)
        : {};

      if (typeof window === "undefined") {
        if (ctx.res && ctx.res.finished) {
          return {};
        }

        if (ssr) {
          try {
            const { getDataFromTree } = await import("@apollo/react-ssr");
            await getDataFromTree(
              <AppTree
                pageProps={{
                  ...pageProps,
                  apolloClient
                }}
              />
            );
          } catch (error) {
            // tslint:disable-next-line:no-console
            console.error("Error while running `getDataFromTree`", error);
          }
        }

        Head.rewind();
      }

      const apolloState = apolloClient.cache.extract();

      if (tempSession) {
        return {
          ...pageProps,
          apolloState
        };
      } else {
        try {
          const { data, error } = await apolloClient.query({
            query: ME_QUERY,
            errorPolicy: "all"
          });

          if (onlyWithoutSession && data && data.me) {
            redirect(ctx, "/app");
          }

          if (requiresSession && !(data && data.me)) {
            redirect(ctx, "/");
          }

          return {
            ...pageProps,
            apolloState,
            userData: data && data.me
          };
        } catch (e) {
          return {
            ...pageProps,
            apolloState,
            userDataError: e
          };
        }
      }
    };
  }

  return WithApollo;
}

const apolloClients = {};

function initApolloClient(
  apolloState,
  tempSession: string,
  req?: NextApiRequest
) {
  const sessionMethods = {
    getToken: () => getToken(tempSession, req),
    onSessionError: error => onSessionError(error, tempSession)
  };

  if (typeof window === "undefined") {
    return createClient(apolloState, sessionMethods);
  }

  // Reuse client on the client-side
  if (!apolloClients[tempSession]) {
    apolloClients[tempSession] = createClient(apolloState, sessionMethods);
  }

  return apolloClients[tempSession];
}
