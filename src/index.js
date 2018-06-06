import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './base-styles';
import Editor from './components/Editor';
import store from './store';

const Index = () => (
  <Provider store={store}>
    <Editor />
  </Provider>
)

ReactDOM.render(<Index />, document.getElementById("index"));
