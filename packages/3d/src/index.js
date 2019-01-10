import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root';
import {TranslateProvider} from '@bitbloq/ui';
import './base-styles';

import en from './assets/messages/en.json';
import es from './assets/messages/es.json';

const messagesFiles = { en, es };

ReactDOM.render(
  <TranslateProvider messagesFiles={messagesFiles}>
    <Root />,
  </TranslateProvider>,
  document.getElementById("index")
);
