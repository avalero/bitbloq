import { combineReducers } from 'redux';
import bloqs from './bloqs';
import hardware from './hardware';
import code from './code';

const bloqtest = combineReducers({
  bloqs,
  hardware,
  code
});

export default bloqtest;
