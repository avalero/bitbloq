import {handleActions} from 'redux-actions';
import undoable from '../../lib/undoable';
import config from '../../config/threed';
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
        const {parameters = {}} = payload;
        const {children = []} = parameters;
        return [
          ...state.filter(o => !children.includes(o)),
          {
            ...payload,
            name: createObjectName(payload.type, state),
            parameters: {
              ...parameters,
              color:
                config.colors[Math.floor(Math.random() * config.colors.length)],
            },
          },
        ];
      },
    ],
    [actions.addObjects, (state, {payload}) => [...state, ...payload]],
    [
      actions.updateObjectName,
      (state, {payload}) =>
        updateObject(state, {...payload.object, name: payload.name}),
    ],
    [
      actions.updateObjectParameter,
      (state, {payload: {object, parameter, value}}) =>
        updateObject(state, {
          ...object,
          parameters: {...object.parameters, [parameter]: value},
        }),
    ],
    [
      actions.updateOperationParameter,
      (state, {payload: {object, operation, parameter, value}}) =>
        updateObject(state, {
          ...object,
          operations: object.operations.map(
            o => (o === operation ? {...o, [parameter]: value} : o),
          ),
        }),
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
      },
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
      },
    ],
    [
      actions.removeOperation,
      (state, {payload}) =>
        updateObject(state, {
          ...payload.object,
          operations: payload.object.operations.filter(
            op => op !== payload.operation,
          ),
        }),
    ],
    [
      actions.reorderOperation,
      (state, {payload: {object, operation, from, to}}) => {
        const operations = [...object.operations];
        operations.splice(from, 1);
        operations.splice(to, 0, operation);
        return updateObject(state, {
          ...object,
          operations,
        });
      },
    ],
    [
      actions.deleteObject,
      (state, {payload}) => state.filter(o => o !== payload)
    ],
    [
      actions.undoComposition,
      (state, {payload}) => {
        const {parameters = {}} = payload;
        const {children = []} = parameters;
        const index = state.indexOf(payload);

        return [
          ...state.slice(0, index),
          ...children,
          ...state.slice(index + 1),
        ];
      },
    ],
  ]),
  initialState,
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
