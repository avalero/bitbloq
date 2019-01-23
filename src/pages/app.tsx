import * as React from "react";
import NoSSR from "react-no-ssr";
import { Router } from "@reach/router";
import { Global } from "@emotion/core";
import Activate from "../components/Activate";
import Documents from "../components/Documents";
import Document from "../components/Document";
import ThreeDEditor from "../components/ThreeDEditor";
import ThreeDExercise from "../components/ThreeDExercise";
import ThreeDSubmission from "../components/ThreeDSubmission";
import PrivateRoute from "../components/PrivateRoute";
import { TranslateProvider, baseStyles } from "@bitbloq/ui";
import SEO from "../components/SEO";

import enMessages from "../messages/en.json";

const messagesFiles = {
  en: enMessages
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
            path="/app/exercise/3d/:id"
            component={ThreeDExercise}
          />
          <PrivateRoute
            path="/app/submission/3d/:id"
            component={ThreeDSubmission}
          />
          <PrivateRoute path="/app/activate" component={Activate} />
        </Router>
      </TranslateProvider>
    </NoSSR>
  </>
);

export default AppPage;
