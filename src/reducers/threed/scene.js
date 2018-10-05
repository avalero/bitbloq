import {handleActions} from 'redux-actions';
import undoable from '../../lib/undoable';
import config from '../../config/threed';
import {createFromJSON} from '../../lib/object3d';
import uuid from 'uuid/v1';
import * as actions from '../../actions/threed';

export const findObject = (objects = [], field, value) => {
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

const initialState = [];

const scene = handleActions(
  new Map([
    [
      actions.createObject,
      (state, {payload}) => {
        const shape = shapes[payload.shapeName];
        const name = createObjectName(shape.name, state);
        const object = new shape.objectClass(name, {}, [], payload.id).toJSON();

        return [...state, object];
      }
    ],
    [
      actions.updateObject,
      (state, {payload}) => updateObject(state, payload)
    ],
    [
      actions.duplicateObject,
      (state, {payload}) => {
        const duplicatedObject = {
          ...payload,
          id: uuid(),
          name: createObjectName(payload.name, state),
        };

        return [...state, duplicatedObject];
      }
    ],
    [
      actions.composeObjects,
      (state, {payload}) => {
        const composeOperation = compositionOperations[payload.operationName];
        const composeName = createObjectName(
          composeOperation.name,
          state,
        );
        const composeObject = new composeOperation.objectClass(composeName, {
          children: payload.objects.map(child => createFromJSON(child)),
        }).toJSON();

        return [
          ...state.filter(o => !payload.objects.includes(o)),
          composeObject,
        ];
      }
    ],
    [
      actions.addOperation,
      (state, {payload}) => {
        const operationType = objectOperations[payload.operationName];
        const newOperation = operationType.create();

        const newObject = {
          ...payload.object,
          operations: [...payload.object.operations, newOperation],
        };

        return updateObject(state, newObject);
      }
    ],
    [
      actions.removeOperation,
      (state, {payload}) => updateObject(state, {
        ...payload.object,
        operations: payload.object.operations.filter(
          op => op !== payload.operation,
        ),
      })
    ],
    [
      actions.deleteObject,
      (state, {payload}) => {
        const {parameters = {}} = payload;
        const {children = []} = parameters;
        const index = state.indexOf(payload);

        return [
          ...state.slice(0, index),
          ...children,
          ...state.slice(index + 1),
        ];
      }
    ]
  ]),
  initialState
);

export default undoable(scene, 'THREED_UNDO', 'THREED_REDO', [
  'THREED_CREATE_OBJECT',
  'THREED_UPDATE_OBJECT',
  'THREED_DUPLICATE_OBJECT',
  'THREED_COMPOSE_OBJECTS',
  'THREED_DELETE_OBJECT',
  'THREED_ADD_OPERATION',
  'THREED_REMOVE_OPERATION',
]);
