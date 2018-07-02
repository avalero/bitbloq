import { combineReducers } from 'redux';
import bloqs from './bloqs';
import hardware from './hardware';
import code from './code';
import ui from './ui';

const bloqtest = combineReducers({
  bloqs,
  hardware,
  code,
  ui
});

export default bloqtest;
