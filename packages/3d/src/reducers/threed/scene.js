import { handleActions } from 'redux-actions';
import config from '../../config/threed';
import * as actions from '../../actions/threed';
import { Scene } from '@bitbloq/lib3d';

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
      actions.newScene,
      (state, { payload }) => {
        const scene = Scene.newFromJSON(payload);
        return {
          ...state,
          sceneInstance: scene,
          objects: scene.toJSON(),
        };
      },
    ],
    [
      actions.createObject,
      (state, { payload }) => {
        const { sceneInstance, objects } = state;

        const viewOptions = payload.viewOptions || {};

        const newObject = {
          ...payload,
          viewOptions: {
            ...viewOptions,
            color:
              config.colors[Math.floor(Math.random() * config.colors.length)],
            name: createObjectName(viewOptions.name || payload.type, objects),
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
      (state, { payload: { object, option, value } }) => {
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
      (state, { payload: { object, parameter, value } }) => {
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
      (state, { payload }) => ({
        ...state,
        objects: state.sceneInstance.updateObject(payload),
      }),
    ],
    [
      actions.updateOperation,
      (state, { payload: { object, operation } }) => ({
        ...state,
        objects: state.sceneInstance.updateObject({
          ...object,
          operations: object.operations.map(o =>
            o.id === operation.id ? operation : o
          ),
        }),
      }),
    ],
    [
      actions.duplicateObject,
      (state, { payload }) => ({
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
      (state, { payload: { object, operation } }) => ({
        ...state,
        objects: state.sceneInstance.updateObject({
          ...object,
          operations: [...object.operations, operation],
        }),
      }),
    ],
    [
      actions.removeOperation,
      (state, { payload: { object, operation } }) => ({
        ...state,
        objects: state.sceneInstance.updateObject({
          ...object,
          operations: object.operations.filter(op => op !== operation),
        }),
      }),
    ],
    [
      actions.reorderOperation,
      (state, { payload: { object, operation, from, to } }) => {
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
      (state, { payload }) => ({
        ...state,
        objects: state.sceneInstance.removeObject(payload),
      }),
    ],
    [
      actions.undoComposition,
      (state, { payload }) => ({
        ...state,
        objects: state.sceneInstance.undoObject(payload),
      }),
    ],
    [
      actions.ungroup,
      (state, { payload }) => ({
        ...state,
        objects: state.sceneInstance.undoObject(payload),
      }),
    ],
    [
      actions.convertToGroup,
      (state, { payload }) => ({
        ...state,
        objects: state.sceneInstance.convertToGroup(payload),
      }),
    ],
    [
      actions.undo,
      state => ({
        ...state,
        objects: state.sceneInstance.undo(),
      }),
    ],
    [
      actions.redo,
      state => ({
        ...state,
        objects: state.sceneInstance.redo(),
      }),
    ],
  ]),
  initialState
);

export default scene;
