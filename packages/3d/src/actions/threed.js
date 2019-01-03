import {createAction} from 'redux-actions';

export const newScene = createAction('THREED_NEW_SCENE');
export const createObject = createAction('THREED_CREATE_OBJECT');
export const updateObject = createAction('THREED_UPDATE_OBJECT');
export const updateObjectParameter = createAction(
  'THREED_UPDATE_OBJECT_PARAMETER',
  (object, parameter, value) => ({object, parameter, value}),
);
export const updateObjectViewOption = createAction(
  'THREED_UPDATE_OBJECT_VIEW_OPTION',
  (object, option, value) => ({object, option, value}),
);
export const updateOperation = createAction(
  'THREED_UPDATE_OPERATION_PARAMETER',
  (object, operation) => ({object, operation}),
);
export const duplicateObject = createAction('THREED_DUPLICATE_OBJECT');
export const composeObjects = createAction(
  'THREED_COMPOSE_OBJECTS',
  (objects, operationName) => ({objects, operationName}),
);
export const addOperation = createAction(
  'THREED_ADD_OPERATION',
  (object, operation) => ({object, operation}),
);
export const removeOperation = createAction(
  'THREED_REMOVE_OPERATION',
  (object, operation) => ({object, operation}),
);
export const reorderOperation = createAction(
  'THREED_REORDER_OPERATION',
  (object, operation, from, to) => ({object, operation, from, to}),
);
export const deleteObject = createAction('THREED_DELETE_OBJECT');
export const undoComposition = createAction('THREED_UNDO_COMPOSITION');
export const ungroup = createAction('THREED_UNGROUP');
export const convertToGroup = createAction('THREED_CONVERT_TO_GROUP');

export const selectObject = createAction(
  'THREED_SELECT_OBJECT',
  (object, addToSelection) => ({object, addToSelection}),
);
export const deselectObject = createAction('THREED_DESELECT_OBJECT');
export const deselectAllObjects = createAction('THREED_DESELECT_ALL_OBJECTS');
export const setActiveOperation = createAction(
  'THREED_SET_ACTIVE_OPERATION',
  (object, type, axis, relative) => ({
    object,
    type,
    axis,
    relative,
  }),
);
export const unsetActiveOperation = createAction(
  'THREED_UNSET_ACTIVE_OPERATION',
);
export const undo = createAction('THREED_UNDO');
export const redo = createAction('THREED_REDO');
export const setAdvancedMode = createAction('THREED_SET_ADVANCED_MODE');
