import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './base-styles';
import App from './components/App';
import store from './store';

const Index = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

ReactDOM.render(<Index />, document.getElementById("index"));
