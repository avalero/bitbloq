import {combineReducers} from 'redux';
import hardware from './hardware';
import software from './software';
import threed from './threed/';
import ui from './ui';

const bloqtest = combineReducers({
  hardware,
  software,
  threed,
  ui,
});

export default bloqtest;
