import {handleActions, combineActions} from 'redux-actions';
import {
  selectObject,
  deselectObject,
  deselectAllObjects,
  setActiveOperation,
  unsetActiveOperation,
  createObject,
  deleteObject,
  setAdvancedMode,
} from '../../actions/threed';

let advancedMode;
if (typeof window !== `undefined`) {
  advancedMode = JSON.parse(window.sessionStorage.getItem('advancedMode'));
} else {
  advancedMode = false;
}

const initialState = {
  selectedIds: [],
  activeOperation: null,
  advancedMode
};

const ui = handleActions(
  new Map([
    [
      selectObject,
      (state, {payload}) => ({
        ...state,
        activeOperation: null,
        selectedIds: payload.addToSelection
          ? Array.from(new Set(state.selectedIds).add(payload.object.id))
          : [payload.object.id],
      })
    ],
    [
      deselectObject,
      (state, {payload}) => ({
        ...state,
        activeOperation: null,
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
        activeOperation: null,
        selectedIds: state.selectedIds.filter(id => id !== payload.id),
      }),
    ],
    [
      setAdvancedMode,
      (state, {payload}) => ({...state, advancedMode: payload}),
    ],
  ]),
  initialState,
);

export default ui;
