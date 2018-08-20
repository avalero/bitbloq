export function selectObject(objectId) {
  return {
    type: 'SELECT_OBJECT',
    objectId
  };
}

export function deselectObject(objectId) {
  return {
    type: 'DESELECT_OBJECT',
    objectId
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
