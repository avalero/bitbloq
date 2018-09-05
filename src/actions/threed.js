export function selectObject(object, addToSelection) {
  return {
    type: 'SELECT_OBJECT',
    object,
    addToSelection,
  };
}

export function deselectObject(object) {
  return {
    type: 'DESELECT_OBJECT',
    object,
  };
}

export function createObject(object) {
  return {
    type: 'CREATE_OBJECT',
    object,
  };
}

export function updateObject(object) {
  return {
    type: 'UPDATE_OBJECT',
    object,
  };
}

export function wrapObjects(parent, children) {
  return {
    type: 'WRAP_OBJECTS',
    parent,
    children,
  };
}

export function deleteObject(object) {
  return {
    type: 'DELETE_OBJECT',
    object,
  };
}

export function setActiveOperation(object, operationType, axis, relative) {
  return {
    type: 'SET_ACTIVE_OPERATION',
    object,
    operationType,
    axis,
    relative,
  };
}

export function unsetActiveOperation() {
  return {
    type: 'UNSET_ACTIVE_OPERATION',
  };
}
