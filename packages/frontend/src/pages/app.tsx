import React, { Suspense, useState, useEffect } from "react";
import styled from "@emotion/styled";
import NoSSR from "react-no-ssr";
import { Router } from "@reach/router";
import { Global } from "@emotion/core";
import { TranslateProvider, Spinner, colors, baseStyles } from "@bitbloq/ui";
import { UserDataProvider } from "../lib/useUserData";
import SEO from "../components/SEO";
import SessionWarningModal from "../components/SessionWarningModal";
import FlagsModal from "../components/FlagsModal";
import ErrorLayout from "../components/ErrorLayout";
import { documentTypes } from "../config";
import { useSessionEvent, watchSession, setToken } from "../lib/session";
import useLogout from "../lib/useLogout";

const Activate = React.lazy(() => import("../components/Activate"));
const Documents = React.lazy(() => import("../components/Documents"));
const Document = React.lazy(() => import("../components/Document"));
const PublicDocument = React.lazy(() => import("../components/PublicDocument"));
const EditDocument = React.lazy(() => import("../components/EditDocument"));
const EditExercise = React.lazy(() => import("../components/EditExercise"));
const ViewSubmission = React.lazy(() => import("../components/ViewSubmission"));
const Playground = React.lazy(() => import("../components/Playground"));

import enMessages from "../messages/en.json";
import esMessages from "../messages/es.json";

const messagesFiles = {
  en: enMessages,
  es: esMessages
};

const Route = ({
  component: Component,
  type = "",
  requiresSession = false,
  ...rest
}) => {
  const [anotherSession, setAnotherSession] = useState(false);
  const logout = useLogout();

  useEffect(() => {
    if (requiresSession) {
      watchSession();
    }
  }, []);

  useSessionEvent("error", ({ error }) => {
    const code = error && error.extensions && error.extensions.code;
    if (requiresSession) {
      if (code === "ANOTHER_OPEN_SESSION") {
        setAnotherSession(true);
      } else {
        logout();
      }
    }
  });

  useSessionEvent("expired", () => {
    if (requiresSession) {
      logout(false);
    }
  });

  if (anotherSession) {
    return (
      <ErrorLayout
        title="Has iniciado sesión en otro dispositivo"
        text="Solo se puede tener una sesión abierta al mismo tiempo"
        onOk={() => logout(false)}
      />
    );
  }

  return (
    <Suspense fallback={<Loading type={type} />}>
      <UserDataProvider>
        <Component {...rest} type={type} />
      </UserDataProvider>
      {requiresSession && <SessionWarningModal />}
    </Suspense>
  );
};

const AppPage = () => (
  <>
    <SEO title="App" />
    <Global styles={baseStyles} />
    <NoSSR>
      <TranslateProvider messagesFiles={messagesFiles}>
        <Router>
          <Route path="app" component={Documents} requiresSession />
          <Route
            path="/app/document/:id"
            component={Document}
            requiresSession
          />
          <Route
            path="/app/document/:type/:id"
            component={EditDocument}
            requiresSession
          />
          <Route
            path="/app/public-document/:type/:id"
            component={PublicDocument}
          />
          <Route path="/app/exercise/:type/:id" component={EditExercise} />
          <Route
            path="/app/submission/:type/:id"
            component={ViewSubmission}
            requiresSession
          />
          <Route path="/app/playground/:type" component={Playground} />
          <Route
            path="/app/open-document"
            component={Playground}
            openDocument
          />
          <Route path="/app/activate" component={Activate} />
        </Router>
      </TranslateProvider>
      <FlagsModal />
    </NoSSR>
  </>
);

export default AppPage;

/* styled components */

interface LoadingProps {
  type?: string;
}
const Loading = styled(Spinner)<LoadingProps>`
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: ${(props: LoadingProps) =>
    (props.type && documentTypes[props.type].color) || colors.gray1};
  color: ${(props: LoadingProps) => (props.type ? "white" : "inherit")};
  display: flex;
`;
