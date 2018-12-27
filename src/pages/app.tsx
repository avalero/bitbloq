import * as React from 'react';
import {Router} from '@reach/router';
import Documents from '../components/Documents';
import PrivateRoute from '../components/PrivateRoute';
import SEO from '../components/SEO';

const AppPage = () => (
  <>
    <SEO title="App" />
    <Router>
      <PrivateRoute path="/app" component={Documents} />
    </Router>
  </>
);

export default AppPage;
