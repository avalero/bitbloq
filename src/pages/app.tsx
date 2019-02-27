import * as React from "react";
import NoSSR from "react-no-ssr";
import { Router } from "@reach/router";
import { Global } from "@emotion/core";
import Activate from "../components/Activate";
import Documents from "../components/Documents";
import Document from "../components/Document";
import EditDocument from "../components/EditDocument";
import EditExercise from "../components/EditExercise";
import ViewSubmission from "../components/ViewSubmission";
import PrivateRoute from "../components/PrivateRoute";
import { TranslateProvider, baseStyles } from "@bitbloq/ui";
import SEO from "../components/SEO";

import enMessages from "../messages/en.json";
import esMessages from "../messages/es.json";

const messagesFiles = {
  en: enMessages,
  es: esMessages
};

const AppPage = () => (
  <>
    <SEO title="App" />
    <Global styles={baseStyles} />
    <NoSSR>
      <TranslateProvider messagesFiles={messagesFiles}>
        <Router>
          <PrivateRoute path="/app" component={Documents} />
          <PrivateRoute path="/app/document/:id" component={Document} />
          <PrivateRoute
            path="/app/document/:type/:id"
            component={EditDocument}
          />
          <PrivateRoute
            path="/app/exercise/:type/:id"
            component={EditExercise}
          />
          <PrivateRoute
            path="/app/submission/:type/:id"
            component={ViewSubmission}
          />
          <PrivateRoute path="/app/activate" component={Activate} />
        </Router>
      </TranslateProvider>
    </NoSSR>
  </>
);

export default AppPage;
