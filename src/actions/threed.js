export function selectObject(object) {
  return {
    type: 'SELECT_OBJECT',
    object
  };
}

export function deselectObject(object) {
  return {
    type: 'DESELECT_OBJECT',
    object
  };
}

export function createObject(object) {
  return {
    type: 'CREATE_OBJECT',
    object
  };
}

export function updateObject(object) {
  return {
    type: 'UPDATE_OBJECT',
    object
  };
}

export function wrapObjects(parent, children) {
  return {
    type: 'WRAP_OBJECTS',
    parent,
    children
  };
}

export function deleteObject(object) {
  return {
    type: 'DELETE_OBJECT',
    object
  };
}
