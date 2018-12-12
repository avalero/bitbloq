import {handleActions} from 'redux-actions';
import undoable from '../../lib/undoable';
import config from '../../config/threed';
import uuid from 'uuid/v1';
import * as actions from '../../actions/threed';
import Scene from '../../lib/object3dts/Scene';

export const findObject = (objects = [], fn) => {
  if (!objects.length) return undefined;
  const [first, ...rest] = objects;
  if (fn(first)) return first;
  return findObject(first.children, fn) || findObject(rest, fn);
};

const createObjectName = (base, objects) => {
  let name = base;
  let nameIndex = 1;
  while (findObject(objects, object => object.viewOptions.name === name)) {
    nameIndex++;
    name = base + nameIndex;
  }
  return name;
};

const initialState = {
  sceneInstance: new Scene(),
  objects: [],
};

const scene = handleActions(
  new Map([
    [
      actions.createObject,
      (state, {payload}) => {
        const {sceneInstance, objects} = state;

        const newObject = {
          ...payload,
          viewOptions: {
            color:
              config.colors[Math.floor(Math.random() * config.colors.length)],
            name: createObjectName(payload.type, objects),
          },
        };

        return {
          ...state,
          objects: state.sceneInstance.addNewObjectFromJSON(newObject),
        };
      },
    ],
    [
      actions.updateObjectViewOption,
      (state, {payload: {object, option, value}}) => {
        const updatedObject = {
          ...object,
          viewOptions: {
            ...object.viewOptions,
            [option]: value,
          },
        };

        return {
          ...state,
          objects: state.sceneInstance.updateObject(updatedObject),
        };
      },
    ],
    [
      actions.updateObjectParameter,
      (state, {payload: {object, parameter, value}}) => {
        const updatedObject = {
          ...object,
          parameters: {
            ...object.parameters,
            [parameter]: value,
          },
        };

        return {
          ...state,
          objects: state.sceneInstance.updateObject(updatedObject),
        };
      },
    ],
    [
      actions.updateObject,
      (state, {payload}) => ({
        ...state,
        objects: state.sceneInstance.updateObject(payload)
      })
    ],
    [
      actions.updateOperation,
      (state, {payload: {object, operation}}) => ({
        ...state,
        objects: state.sceneInstance.updateObject({
          ...object,
          operations: object.operations.map(
            o => (o.id === operation.id ? operation : o),
          ),
        }),
      }),
    ],
    [
      actions.duplicateObject,
      (state, {payload}) => ({
        ...state,
        objects: state.sceneInstance.cloneOject({
          ...payload,
          viewOptions: {
            ...payload.viewOptions,
            name: createObjectName(payload.viewOptions.name, state.objects),
          },
        }),
      }),
    ],
    [
      actions.addOperation,
      (state, {payload: {object, operation}}) => ({
        ...state,
        objects: state.sceneInstance.updateObject({
          ...object,
          operations: [...object.operations, operation],
        }),
      }),
    ],
    [
      actions.removeOperation,
      (state, {payload: {object, operation}}) => ({
        ...state,
        objects: state.sceneInstance.updateObject({
          ...object,
          operations: object.operations.filter(op => op !== operation),
        }),
      }),
    ],
    [
      actions.reorderOperation,
      (state, {payload: {object, operation, from, to}}) => {
        const operations = [...object.operations];
        operations.splice(from, 1);
        operations.splice(to, 0, operation);

        return {
          ...state,
          objects: state.sceneInstance.updateObject({
            ...object,
            operations,
          }),
        };
      },
    ],
    [
      actions.deleteObject,
      (state, {payload}) => ({
        ...state,
        objects: state.sceneInstance.removeFromScene(payload)
      }),
    ],
    [
      actions.undoComposition,
      (state, {payload}) => ({
        ...state,
        objects: state.sceneInstance.undoCompound(payload)
      }),
    ],
    [
      actions.ungroup,
      (state, {payload}) => ({
        ...state,
        objects: state.sceneInstance.unGroup(payload)
      }),
    ],
    [
      actions.convertToGroup,
      (state, {payload}) => ({
        ...state,
        objects: state.sceneInstance.convertToGroup(payload)
      }),
    ]
  ]),
  initialState,
);

export default scene;
