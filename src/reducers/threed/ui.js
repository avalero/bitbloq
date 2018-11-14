import {handleActions, combineActions} from 'redux-actions';
import {
  selectObject,
  deselectObject,
  deselectAllObjects,
  setActiveOperation,
  unsetActiveOperation,
  createObject,
  deleteObject,
} from '../../actions/threed';

const initialState = {
  selectedIds: [],
  activeOperation: null,
};

const ui = handleActions(
  new Map([
    [
      selectObject,
      (state, {payload}) => ({
        ...state,
        selectedIds: payload.addToSelection
          ? [...new Set(state.selectedIds).add(payload.object.id)]
          : [payload.object.id],
      }),
    ],
    [
      deselectObject,
      (state, {payload}) => ({
        ...state,
        selectedIds: state.selectedIds.filter(id => id !== payload.id),
      }),
    ],
    [
      deselectAllObjects,
      state => ({
        ...state,
        selectedIds: [],
        activeOperation: null,
      }),
    ],
    [
      setActiveOperation,
      (state, {payload}) => ({...state, activeOperation: payload}),
    ],
    [unsetActiveOperation, state => ({...state, activeOperation: null})],
    [
      deleteObject,
      (state, {payload}) => ({
        ...state,
        selectedIds: state.selectedIds.filter(id => id !== payload.id),
      }),
    ],
  ]),
  initialState,
);

export default ui;
