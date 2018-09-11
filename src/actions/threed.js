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

export function createObject(shapeName) {
  return {
    type: 'CREATE_OBJECT',
    shapeName,
  };
}

export function updateObject(object) {
  return {
    type: 'UPDATE_OBJECT',
    object,
  };
}

export function composeObjects(objects, operationName) {
  return {
    type: 'COMPOSE_OBJECTS',
    objects,
    operationName,
  };
}

export function addOperation(object, operationName) {
  return {
    type: 'ADD_OPERATION',
    object,
    operationName,
  };
}

export function removeOperation(object, operation) {
  return {
    type: 'REMOVE_OPERATION',
    object,
    operation,
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
