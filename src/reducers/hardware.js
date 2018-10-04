import {handleActions} from 'redux-actions';
import {updateComponents} from '../actions/hardware';

const initialBoard = {
  className: 'Zumjunior',
};

const initialState = {
  board: initialBoard,
  components: []
};

const hardware = handleActions(
  new Map([
    [
      updateComponents,
      (state, {payload}) => ({...state, components: payload})
    ]
  ]),
  initialState
);

export default hardware;
