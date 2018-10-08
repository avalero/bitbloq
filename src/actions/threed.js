import {createAction} from 'redux-actions';

export const createObject = createAction(
  'THREED_CREATE_OBJECT',
  (id, shapeName) => ({id, shapeName}),
);
export const updateObjectName = createAction(
  'THREED_UPDATE_OBJECT_NAME',
  (object, name) => ({object, name}),
);
export const updateObjectParameter = createAction(
  'THREED_UPDATE_OBJECT_PARAMETER',
  (object, parameter, value) => ({object, parameter, value}),
);
export const updateOperationParameter = createAction(
  'THREED_UPDATE_OPERATION_PARAMETER',
  (object, operation, parameter, value) => ({
    object,
    operation,
    parameter,
    value,
  }),
);
export const duplicateObject = createAction('THREED_DUPLICATE_OBJECT');
export const composeObjects = createAction(
  'THREED_COMPOSE_OBJECTS',
  (objects, operationName) => ({objects, operationName}),
);
export const addOperation = createAction(
  'THREED_ADD_OPERATION',
  (object, operationName) => ({object, operationName}),
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
export const showContextMenu = createAction(
  'THREED_SHOW_CONTEXT_MENU',
  (object, x, y) => ({object, x, y}),
);
export const hideContextMenu = createAction('THREED_HIDE_CONTEXT_MENU');
export const editObjectName = createAction('THREED_EDIT_OBJECT_NAME');
export const stopEditingObjectName = createAction(
  'THREED_STOP_EDITING_OBJECT_NAME',
);
export const undo = createAction('THREED_UNDO');
export const redo = createAction('THREED_REDO');
