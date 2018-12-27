import * as React from 'react';
import {navigate} from 'gatsby';

const isLoggedIn = true;

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  if(!isLoggedIn) {
    navigate('/');
    return null;
  }

  return <Component {...rest} />
};

export default PrivateRoute;
