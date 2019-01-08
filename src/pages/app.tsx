import * as React from 'react';
import NoSSR from 'react-no-ssr';
import {Router} from '@reach/router';
import {Global} from '@emotion/core';
import Documents from '../components/Documents';
import Document from '../components/Document';
import ThreeDDocument from '../components/ThreeDDocument';
import PrivateRoute from '../components/PrivateRoute';
import {baseStyles} from '@bitbloq/ui';
import {TranslateProvider} from '@bitbloq/3d';
import SEO from '../components/SEO';

import enMessages from '../messages/en.json';

const messagesFiles = {
  'en': enMessages
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
          <PrivateRoute path="/app/edit/3d/:id" component={ThreeDDocument} />
        </Router>
      </TranslateProvider>
    </NoSSR>
  </>
);

export default AppPage;
