import undoable from '../lib/undoable';
import config from '../config/threed';
import {createFromJSON} from '../lib/object3d';
import uuid from 'uuid/v1';

const initialState = {
  selectedIds: [],
  objects: [],
  activeOperation: null,
  contextMenu: {
    visible: false,
    object: null,
    position: {},
  },
  editingObjectName: false,
};

const findObject = (objects = [], field, value) => {
  if (!objects.length) {
    return undefined;
  }

  const [first, ...rest] = objects;
  const {parameters: {children = []} = {}} = first;

  if (first[field] === value) {
    return first;
  }

  return findObject(children, field, value) || findObject(rest, field, value);
};

const shapes = {};
config.shapes.forEach(shape => (shapes[shape.name] = shape));

const objectOperations = {};
config.objectOperations.forEach(
  operation => (objectOperations[operation.name] = operation),
);

const compositionOperations = {};
config.compositionOperations.forEach(
  operation => (compositionOperations[operation.name] = operation),
);

const updateObject = (objects, updated) => {
  return objects.map(object => {
    if (object.id === updated.id) {
      return updated;
    } else {
      const {parameters: {children = []} = {}} = object;
      if (children.length) {
        const updatedChildren = updateObject(children, updated);
        if (
          children.length === updatedChildren.length &&
          children.every(c => updatedChildren.includes(c))
        ) {
          return object;
        } else {
          return {
            ...object,
            parameters: {
              ...object.parameters,
              children: updateObject(children, updated),
            },
          };
        }
      } else {
        return object;
      }
    }
  });
};

const createObjectName = (base, objects) => {
  let name = base;
  let nameIndex = 1;
  while (findObject(objects, 'name', name)) {
    nameIndex++;
    name = base + nameIndex;
  }
  return name;
};

const threed = (state = initialState, action) => {
  let name;

  switch (action.type) {
    case 'SELECT_OBJECT':
      return {
        ...state,
        selectedIds: action.addToSelection
          ? [...new Set(state.selectedIds).add(action.object.id)]
          : [action.object.id],
      };

    case 'DESELECT_OBJECT':
      return {
        ...state,
        selectedIds: state.selectedIds.filter(id => id !== action.object.id),
      };

    case 'DESELECT_ALL_OBJECTS':
      return {
        ...state,
        selectedIds: [],
        activeOperation: null,
      };

    case 'CREATE_OBJECT':
      const shape = shapes[action.shapeName];
      const name = createObjectName(shape.name, state.objects);
      const object = new shape.objectClass(name).toJSON();

      return {
        ...state,
        objects: [...state.objects, object],
        selectedIds: [object.id],
      };

    case 'UPDATE_OBJECT':
      return {
        ...state,
        objects: updateObject(state.objects, action.object),
      };

    case 'DUPLICATE_OBJECT':
      const duplicatedObject = {
        ...action.object,
        id: uuid(),
        name: createObjectName(action.object.name, state.objects),
      };

      return {
        ...state,
        objects: [...state.objects, duplicatedObject],
        selectedIds: [duplicatedObject.id],
      };

    case 'COMPOSE_OBJECTS':
      const composeOperation = compositionOperations[action.operationName];
      const composeName = createObjectName(
        composeOperation.name,
        state.objects,
      );
      const composeObject = new composeOperation.objectClass(composeName, {
        children: action.objects.map(child => createFromJSON(child)),
      }).toJSON();

      return {
        ...state,
        objects: [
          ...state.objects.filter(o => !action.objects.includes(o)),
          composeObject,
        ],
        selectedIds: [composeObject.id],
        activeOperation: null,
      };

    case 'DELETE_OBJECT':
      const {parameters = {}} = action.object;
      const {children = []} = parameters;
      const index = state.objects.indexOf(action.object);

      return {
        ...state,
        objects: [
          ...state.objects.slice(0, index),
          ...children,
          ...state.objects.slice(index + 1),
        ],
        selectedIds: state.selectedIds.filter(id => id !== action.object.id),
        activeOperation: null,
      };

    case 'ADD_OPERATION':
      const operationType = objectOperations[action.operationName];
      const newOperation = operationType.create();

      const newObject = {
        ...action.object,
        operations: [...action.object.operations, newOperation],
      };

      return {
        ...state,
        objects: updateObject(state.objects, newObject),
      };

    case 'REMOVE_OPERATION':
      return {
        ...state,
        objects: updateObject(state.objects, {
          ...action.object,
          operations: action.object.operations.filter(
            op => op !== action.operation,
          ),
        }),
      };

    case 'SET_ACTIVE_OPERATION':
      return {
        ...state,
        activeOperation: {
          object: action.object,
          type: action.operationType,
          axis: action.axis,
          relative: action.relative,
        },
      };

    case 'UNSET_ACTIVE_OPERATION':
      return {
        ...state,
        activeOperation: null,
      };

    case 'SHOW_CONTEXT_MENU':
      return {
        ...state,
        contextMenu: {
          visible: true,
          object: action.object,
          position: {x: action.x, y: action.y},
        },
      };

    case 'APP_CLICK':
    case 'HIDE_CONTEXT_MENU':
      return {
        ...state,
        contextMenu: {
          visible: false,
          object: null,
          position: {},
        },
      };

    case 'EDIT_OBJECT_NAME':
      return {
        ...state,
        editingObjectName: true,
        selectedIds: [action.object.id],
      };

    case 'STOP_EDITING_OBJECT_NAME':
      return {
        ...state,
        editingObjectName: false,
      };

    default:
      return state;
  }
};

export default undoable(threed, 'THREED_UNDO', 'THREED_REDO', [
  'CREATE_OBJECT',
  'UPDATE_OBJECT',
  'DUPLICATE_OBJECT',
  'COMPOSE_OBJECTS',
  'DELETE_OBJECT',
  'ADD_OPERATION',
  'REMOVE_OPERATION',
]);

export const getSelectedObjects = state =>
  state.present.selectedIds.map(id =>
    findObject(state.present.objects, 'id', id),
  );
