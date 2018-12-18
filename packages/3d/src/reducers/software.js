import {handleActions} from 'redux-actions';

import {
  updateBloqs,
  updateCode,
  uploadCode,
} from '../actions/software';

const initialState = {
  code: '',
  bloqs: []
};

const software = handleActions(
  new Map([
    [
      updateBloqs,
      (state, {payload}) => ({...state, bloqs: payload})
    ],
    [
      updateCode,
      (state, {payload}) => ({...state, code: payload})
    ],
  ]),
  initialState
);

export default software;
