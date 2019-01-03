import React from 'react';
import {Provider} from 'react-redux';
import App from './components/App';
import store from './store';

const Root = (props) => (
  <Provider store={store}>
    <App {...props} />
  </Provider>
);

export default Root;
