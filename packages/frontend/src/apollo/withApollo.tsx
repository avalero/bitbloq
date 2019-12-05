import React, { FC, useEffect, useState } from "react";
import Router from "next/router";
import cookie from "cookie";
import { NextApiRequest, NextPageContext } from "next";
import Head from "next/head";
import { ApolloClient } from "apollo-client";
import { ApolloProvider, useMutation } from "@apollo/react-hooks";
import { createClient } from "./client";
import {
  ME_QUERY,
  RENEW_TOKEN_MUTATION,
  USER_SESSION_EXPIRES_SUBSCRIPTION,
  RENEW_SESSION_MUTATION
} from "./queries";
import {
  getToken,
  setToken,
  renewToken,
  shouldRenewToken,
  onSessionError,
  onSessionActivity,
  watchSession,
  logout,
  useSessionEvent
} from "../lib/session";
import { UserDataProvider } from "../lib/useUserData";
import redirect from "../lib/redirect";
import SessionWarningModal from "../components/SessionWarningModal";
import ErrorLayout from "../components/ErrorLayout";
import { Subscription } from "react-apollo";
import { ISessionExpires } from "../../../api/src/api-types";
import { DialogModal } from "@bitbloq/ui";

export interface IContext extends NextPageContext {
  apolloClient: ApolloClient<any>;
}

interface ISessionWatcherProps {
  tempSession?: string;
  client: ApolloClient<any>;
}

const SessionWatcher: FC<ISessionWatcherProps> = ({ tempSession, client }) => {
  const [sessionExpired, setSessionExpired] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [anotherSession, setAnotherSession] = useState(false);

  const [renewSession] = useMutation(RENEW_SESSION_MUTATION);

  useSessionEvent(
    "error",
    ({ error }) => {
      const code = error && error.extensions && error.extensions.code;
      if (code === "ANOTHER_OPEN_SESSION") {
        setAnotherSession(true);
        setToken("");
      }
      if (code === "UNAUTHENTICATED") {
        Router.replace("/");
      }
    },
    tempSession
  );

  useSessionEvent("logout", async () => {
    setToken("");
    if (client) {
      await client.cache.reset();
      await client.reFetchObservableQueries();
    }
    Router.replace("/");
  });

  useSessionEvent(
    "activity",
    () => {
      console.log("activity");
    },
    tempSession
  );

  if (anotherSession) {
    return (
      <ErrorLayout
        title="Has iniciado sesión en otro dispositivo"
        text="Solo se puede tener una sesión abierta al mismo tiempo"
        onOk={() => logout()}
      />
    );
  }
  return (
    <>
      <DialogModal
        isOpen={sessionExpired}
        title="¿Sigues ahí?"
        content={
          <p>
            Parece que te has ido, si no quieres seguir trabajando saldrás de tu
            cuenta en <b>{secondsRemaining} segundos</b>.
          </p>
        }
        okText="Si, quiero seguir trabajando"
        onOk={async () => {
          await renewSession();
          setSessionExpired(false);
        }}
      />
      <Subscription
        subscription={USER_SESSION_EXPIRES_SUBSCRIPTION}
        shouldResubscribe={true}
        onSubscriptionData={({ subscriptionData }) => {
          const userSessionExpires: ISessionExpires =
            (subscriptionData.data &&
              subscriptionData.data.userSessionExpires) ||
            {};
          if (userSessionExpires.expiredSession) {
            logout();
          }
          if (Number(userSessionExpires.secondsRemaining) < 350) {
            setSessionExpired(true);
            setSecondsRemaining(
              Math.ceil(Number(userSessionExpires.secondsRemaining))
            );
          }
          if (
            !userSessionExpires.expiredSession &&
            Number(userSessionExpires.secondsRemaining) > 350
          ) {
            setSessionExpired(false);
          }
        }}
      />
    </>
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
        <SessionWatcher tempSession={tempSession} client={client} />
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
        const { data, error } = await apolloClient.query({
          query: ME_QUERY,
          errorPolicy: "ignore"
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
    onSessionError: error => onSessionError(error, tempSession),
    onSessionActivity: () => onSessionActivity()
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
