import * as React from 'react';
import {navigate} from 'gatsby';

const isLoggedIn = true;

const PrivateRoute = ({ component: Component, ...rest }) => {
  if(!isLoggedIn) {
    navigate('/');
    return null;
  }

  return <Component {...rest} />
};

export default PrivateRoute;
