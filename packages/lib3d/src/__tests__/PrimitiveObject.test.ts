import "jsdom-worker";
interface Global {
  fetch: any;
}
const global: Global = { fetch: undefined };
global.fetch = require("jest-fetch-mock");

import { cloneDeep } from "lodash";
import * as THREE from "three";
import Cube from "../Cube";
import ObjectsCommon from "../ObjectsCommon";
import ObjectsGroup from "../ObjectsGroup";
import RepetitionObject from "../RepetitionObject";

import {
  ICubeJSON,
  ICubeParams,
  IViewOptions,
  OperationsArray,
  ICartesianRepetitionParams
} from "../Interfaces";

const width = 10;
const height = 15;
const depth = 20;

const objParams: ICubeParams = {
  width,
  height,
  depth
};
const operations: OperationsArray = [];
const viewOptions: IViewOptions = ObjectsCommon.createViewOptions();

test("PrimitiveObject - toJSON", () => {
  const json: ICubeJSON = {
    parameters: {
      width,
      height,
      depth
    },
    operations: [],
    viewOptions: ObjectsCommon.createViewOptions(),
    id: "000",
    type: Cube.typeName
  };

  const obj = new Cube(objParams, operations, viewOptions);
  json.id = obj.toJSON().id;

  expect(json).toEqual(obj.toJSON());

  (obj as any).operations = [
    ObjectsCommon.createTranslateOperation(10, 20, 30)
  ];
  json.operations = [ObjectsCommon.createTranslateOperation(10, 20, 30)];
  json.operations[0].id = obj.toJSON().operations[0].id;

  expect(json).toEqual(obj.toJSON());

  (obj as any).operations = [
    ObjectsCommon.createTranslateOperation(10, 20, 30),
    ObjectsCommon.createTranslateOperation(10, 20, 30)
  ];
  json.operations = [
    ObjectsCommon.createTranslateOperation(10, 20, 30),
    ObjectsCommon.createTranslateOperation(10, 20, 30)
  ];
  json.operations[0].id = obj.toJSON().operations[0].id;
  json.operations[1].id = obj.toJSON().operations[1].id;

  expect(json).toEqual(obj.toJSON());

  (obj as any).parameters = { width: 10, height: 20, depth: 30 };
  json.parameters = { width: 10, height: 20, depth: 30 };

  expect(json).toEqual(obj.toJSON());
});

test("PrimitiveObject - UpdateFromJSON", async () => {
  const json: ICubeJSON = {
    parameters: {
      width,
      height,
      depth
    },
    operations: [],
    viewOptions: ObjectsCommon.createViewOptions(),
    id: "000",
    type: Cube.typeName
  };

  const obj = new Cube(objParams, operations, viewOptions);
  json.id = "kkk";

  const func = () => obj.updateFromJSON(json);

  expect(func).toThrowError();
});

test("PrimitiveObject - UpdateFromJSON", async () => {
  const json: ICubeJSON = {
    parameters: {
      width,
      height,
      depth
    },
    operations: [],
    viewOptions: ObjectsCommon.createViewOptions(),
    id: "000",
    type: Cube.typeName
  };

  const obj = new Cube(objParams, operations, viewOptions);
  const spy = jest.spyOn(obj, "computeMeshAsync");
  json.id = obj.toJSON().id;

  expect(json).toEqual(obj.toJSON());

  json.operations = [ObjectsCommon.createTranslateOperation(10, 20, 30)];
  obj.updateFromJSON(json);

  expect(json).toEqual(obj.toJSON());
  expect(spy).toBeCalledTimes(1);

  json.operations = [
    ObjectsCommon.createTranslateOperation(10, 20, 30),
    ObjectsCommon.createTranslateOperation(10, 20, 30)
  ];
  obj.updateFromJSON(json);

  expect(json).toEqual(obj.toJSON());
  expect(spy).toBeCalledTimes(2);

  json.parameters = { width: 10, height: 20, depth: 30 };
  obj.updateFromJSON(json);

  expect(spy).toBeCalledTimes(3);
  expect(json).toEqual(obj.toJSON());

  // no changes, so computeMeshAsync should not be recalled

  obj.updateFromJSON(json);

  expect(spy).toBeCalledTimes(3);

  // already computed, so computeMeshAsync should not be recalled
  await obj.getMeshAsync();
  expect(spy).toBeCalledTimes(3);
});

test("PrimitiveObject - UpdateFromJSON with parents", async () => {
  const json: ICubeJSON = {
    parameters: {
      width,
      height,
      depth
    },
    operations: [],
    viewOptions: ObjectsCommon.createViewOptions(),
    id: "000",
    type: Cube.typeName
  };

  const repParamas: ICartesianRepetitionParams = {
    type: "cartesian",
    x: 10,
    y: 0,
    z: 0,
    num: 2
  };

  const obj = new Cube({ ...objParams }, [...operations], { ...viewOptions });
  const obj2 = new RepetitionObject(repParamas, obj);

  const spy1 = jest.spyOn(obj, "computeMeshAsync");
  const spy2 = jest.spyOn(obj2, "computeMeshAsync");

  json.id = obj.toJSON().id;

  expect(json).toEqual(obj.toJSON());

  json.operations = [ObjectsCommon.createTranslateOperation(10, 20, 30)];
  obj.updateFromJSON(json);

  expect(json).toEqual(obj.toJSON());
  expect(spy1).toBeCalledTimes(2);
  expect(spy2).toBeCalledTimes(1);

  json.operations = [
    ObjectsCommon.createTranslateOperation(10, 20, 30),
    ObjectsCommon.createTranslateOperation(10, 20, 30)
  ];
  obj.updateFromJSON(json);

  expect(json).toEqual(obj.toJSON());
  expect(spy1).toBeCalledTimes(4);
  expect(spy2).toBeCalledTimes(2);

  json.parameters = { width: 10, height: 20, depth: 30 };
  obj.updateFromJSON(json);

  expect(spy1).toBeCalledTimes(6);
  expect(spy2).toBeCalledTimes(3);
  expect(json).toEqual(obj.toJSON());

  // no changes, so computeMeshAsync should not be recalled

  obj.updateFromJSON(json);

  expect(spy1).toBeCalledTimes(6);
  expect(spy2).toBeCalledTimes(3);

  // already computed, so computeMeshAsync should not be recalled
  await obj.getMeshAsync();
  expect(spy1).toBeCalledTimes(6);
  expect(spy2).toBeCalledTimes(3);
});

test("PrimitiveObject - UpdateFromJSON with parents - change viewOptions", async () => {
  const json: ICubeJSON = {
    parameters: {
      width,
      height,
      depth
    },
    operations: [],
    viewOptions: ObjectsCommon.createViewOptions(),
    id: "000",
    type: Cube.typeName
  };

  const repParamas: ICartesianRepetitionParams = {
    type: "cartesian",
    x: 10,
    y: 0,
    z: 0,
    num: 2
  };

  const obj = new Cube({ ...objParams }, [...operations], { ...viewOptions });
  const obj2 = new RepetitionObject(repParamas, obj);

  const spy1 = jest.spyOn(obj, "computeMeshAsync");
  const spy2 = jest.spyOn(obj2, "computeMeshAsync");

  json.id = obj.toJSON().id;

  expect(json).toEqual(obj.toJSON());

  json.parameters.depth = 1000;
  obj.updateFromJSON(json);

  expect(json).toEqual(obj.toJSON());
  expect(spy1).toBeCalledTimes(2);
  expect(spy2).toBeCalledTimes(1);
});

test("PrimitiveObject - UpdateFromJSON with parent Repetition - change viewOptions", async () => {
  const json: ICubeJSON = {
    parameters: {
      width,
      height,
      depth
    },
    operations: [],
    viewOptions: ObjectsCommon.createViewOptions(),
    id: "000",
    type: Cube.typeName
  };

  const obj = new Cube(objParams, operations, viewOptions);
  const obj2 = new RepetitionObject(
    { type: "cartesian", x: 10, y: 10, z: 10, num: 4 },
    obj
  );

  obj.setParent(obj2);

  const spy1 = jest.spyOn(obj, "computeMeshAsync");
  const spy2 = jest.spyOn(obj2, "computeMeshAsync");

  json.id = obj.toJSON().id;

  expect(json).toEqual(obj.toJSON());

  json.viewOptions = { ...json.viewOptions, color: "#aaaaaa" };
  obj.updateFromJSON(json);

  expect(json).toEqual(obj.toJSON());
  // expect(spy1).toBeCalledTimes(1);
  expect(spy2).toBeCalledTimes(1);
});

test("PrimitiveObject - UpdateFromJSON with parent ObjectsGroup - change viewOptions", async () => {
  const json: ICubeJSON = {
    parameters: {
      width,
      height,
      depth
    },
    operations: [],
    viewOptions: ObjectsCommon.createViewOptions(),
    id: "000",
    type: Cube.typeName
  };

  const obj = new Cube(objParams, operations, viewOptions);
  const obj1 = new Cube(objParams, operations, viewOptions);
  const obj2 = new ObjectsGroup([obj, obj1]);

  obj.setParent(obj2);

  const spy1 = jest.spyOn(obj, "computeMeshAsync");
  const spy2 = jest.spyOn(obj2, "computeMeshAsync");

  json.id = obj.toJSON().id;

  expect(json).toEqual(obj.toJSON());

  json.viewOptions = { ...json.viewOptions, color: "#aaaaaa" };
  obj.updateFromJSON(json);

  expect(json).toEqual(obj.toJSON());
  expect(spy1).toBeCalledTimes(1);
  expect(spy2).toBeCalledTimes(1);
});

test("PrimitiveObject - UpdateFromJSON with 2 level parents", async () => {
  const json: ICubeJSON = {
    parameters: {
      width,
      height,
      depth
    },
    operations: [],
    viewOptions: ObjectsCommon.createViewOptions(),
    id: "000",
    type: Cube.typeName
  };

  const repParamas: ICartesianRepetitionParams = {
    type: "cartesian",
    x: 10,
    y: 0,
    z: 0,
    num: 2
  };

  const obj = new Cube({ ...objParams }, [...operations], { ...viewOptions });
  const obj2 = new RepetitionObject(repParamas, obj);
  const obj3 = new RepetitionObject(repParamas, obj2);

  const spy1 = jest.spyOn(obj, "computeMeshAsync");
  const spy2 = jest.spyOn(obj2, "computeMeshAsync");
  const spy3 = jest.spyOn(obj3, "computeMeshAsync");

  json.id = obj.toJSON().id;

  expect(json).toEqual(obj.toJSON());
  json.operations = [ObjectsCommon.createTranslateOperation(10, 20, 30)];
  obj.updateFromJSON(json);

  expect(json).toEqual(obj.toJSON());
  expect(spy1).toBeCalledTimes(3);
  expect(spy2).toBeCalledTimes(2);
  expect(spy3).toBeCalledTimes(1);

  json.operations = [
    ObjectsCommon.createTranslateOperation(10, 20, 30),
    ObjectsCommon.createTranslateOperation(10, 20, 30)
  ];
  obj.updateFromJSON(json);

  expect(json).toEqual(obj.toJSON());
  expect(spy1).toBeCalledTimes(6);
  expect(spy2).toBeCalledTimes(4);
  expect(spy3).toBeCalledTimes(2);

  json.parameters = { width: 10, height: 20, depth: 30 };
  obj.updateFromJSON(json);

  expect(spy1).toBeCalledTimes(9);
  expect(spy2).toBeCalledTimes(6);
  expect(spy3).toBeCalledTimes(3);
  expect(json).toEqual(obj.toJSON());

  // no changes, so computeMeshAsync should not be recalled
  obj.updateFromJSON(json);

  expect(spy1).toBeCalledTimes(9);
  expect(spy2).toBeCalledTimes(6);
  expect(spy3).toBeCalledTimes(3);

  // already computed, so computeMeshAsync should not be recalled
  await obj.getMeshAsync();
  expect(spy1).toBeCalledTimes(9);
  expect(spy2).toBeCalledTimes(6);
  expect(spy3).toBeCalledTimes(3);
});

test("PrimitiveObject - getMeshAsync", async () => {
  const obj = new Cube(objParams, operations, viewOptions);
  const spy = jest.spyOn(obj, "computeMeshAsync");

  const mesh: THREE.Mesh = (await obj.getMeshAsync()) as THREE.Mesh;
  expect((obj as any).meshPromise).toBe(null);
  expect(spy).toBeCalledTimes(0);
  expect(mesh).toBeInstanceOf(THREE.Mesh);
  expect(mesh.geometry).toBeInstanceOf(THREE.Geometry);
  expect(mesh).toBe((obj as any).mesh);

  const meshPromise = obj.getMeshAsync();
  expect(meshPromise).toBeInstanceOf(Promise);
});

test("PrimitiveObject - ComputeMeshAsync - meshUpdateRequired", async () => {
  const obj = new Cube(objParams, operations, viewOptions);
  (obj as any)._meshUpdateRequired = true;
  (obj as any)._pendingOperation = false;
  (obj as any)._viewOptionsUpdateRequired = false;

  const spy1 = jest.spyOn(obj as any, "getGeometry");
  const spy2 = jest.spyOn(obj as any, "applyViewOptions");
  const spy3 = jest.spyOn(obj as any, "applyOperationsAsync");

  await obj.computeMeshAsync();

  expect(spy1).toBeCalledTimes(1);
  expect(spy2).toBeCalledTimes(1);
  expect(spy3).toBeCalledTimes(1);
  expect((obj as any)._meshUpdateRequired).toBe(false);
});

test("PrimitiveObject - ComputeMeshAsync - pengingOperation", async () => {
  const obj = new Cube(objParams, operations, viewOptions);
  (obj as any)._meshUpdateRequired = false;
  (obj as any)._pendingOperation = true;
  (obj as any)._viewOptionsUpdateRequired = false;

  const spy1 = jest.spyOn(obj as any, "getGeometry");
  const spy2 = jest.spyOn(obj as any, "applyViewOptions");
  const spy3 = jest.spyOn(obj as any, "applyOperationsAsync");

  await obj.computeMeshAsync();

  expect(spy1).toBeCalledTimes(0);
  expect(spy2).toBeCalledTimes(0);
  expect(spy3).toBeCalledTimes(1);
  expect((obj as any)._pendingOperation).toBe(false);
});

test("PrimitiveObject - ComputeMeshAsync - viewOptionsUpdated", async () => {
  const obj = new Cube(objParams, operations, viewOptions);
  (obj as any)._meshUpdateRequired = false;
  (obj as any)._pendingOperation = false;
  (obj as any)._viewOptionsUpdateRequired = true;

  const spy1 = jest.spyOn(obj as any, "getGeometry");
  const spy2 = jest.spyOn(obj as any, "applyViewOptions");
  const spy3 = jest.spyOn(obj as any, "applyOperationsAsync");

  await obj.computeMeshAsync();

  expect(spy1).toBeCalledTimes(0);
  expect(spy2).toBeCalledTimes(1);
  expect(spy3).toBeCalledTimes(0);
  expect((obj as any)._viewOptionsUpdateRequired).toBe(false);
});

test("PrimitiveObject - SetParameters - same parameters", async () => {
  const obj = new Cube(objParams, operations, viewOptions);
  (obj as any).setParameters(objParams);
  const spy1 = jest.spyOn(obj as any, "computeMeshAsync");
  expect((obj as any)._meshUpdateRequired).toBe(false);
});

test("PrimitiveObject - SetParameters - different parameters", async () => {
  const obj = new Cube(objParams, operations, viewOptions);
  const paramsClone = cloneDeep(objParams);
  paramsClone.width = 2 * objParams.width;
  (obj as any).setParameters(paramsClone);
  expect((obj as any)._meshUpdateRequired).toBe(true);
});
