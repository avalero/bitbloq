import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root';
import {TranslateProvider, baseStyles} from '@bitbloq/ui';
import { Global } from "@emotion/core";

import en from './assets/messages/en.json';
import es from './assets/messages/es.json';

const messagesFiles = { en, es };

ReactDOM.render(
  <TranslateProvider messagesFiles={messagesFiles}>
    <Global styles={baseStyles} />
    <Root />,
  </TranslateProvider>,
  document.getElementById("index")
);
