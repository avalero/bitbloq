import {handleActions, combineActions} from 'redux-actions';
import {
  selectObject,
  deselectObject,
  deselectAllObjects,
  setActiveOperation,
  unsetActiveOperation,
  showContextMenu,
  hideContextMenu,
  editObjectName,
  stopEditingObjectName,
  createObject,
  deleteObject,
} from '../../actions/threed';
import {appClick} from '../../actions/ui';

const initialState = {
  selectedIds: [],
  activeOperation: null,
  contextMenu: {
    visible: false,
    object: null,
    position: {},
  },
  editingObjectName: false,
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
      showContextMenu,
      (state, {payload}) => ({
        ...state,
        contextMenu: {
          visible: true,
          object: payload.object,
          position: {x: payload.x, y: payload.y},
        },
      }),
    ],
    [
      combineActions(appClick, hideContextMenu),
      state => ({
        ...state,
        contextMenu: {
          visible: false,
          object: null,
          position: {},
        },
      }),
    ],
    [
      editObjectName,
      (state, {payload}) => ({
        ...state,
        editingObjectName: true,
        selectedIds: [payload.id],
      }),
    ],
    [stopEditingObjectName, state => ({...state, editingObjectName: false})],
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
