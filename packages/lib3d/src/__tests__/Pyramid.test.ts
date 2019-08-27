import "jsdom-worker";
interface Global {
  fetch: any;
}
const global: Global = { fetch: undefined };
global.fetch = require("jest-fetch-mock");

import * as THREE from "three";
import ObjectsCommon from "../ObjectsCommon";
import Pyramid from "../Pyramid";

import {
  IViewOptions,
  OperationsArray,
  IPyramidJSON,
  IPyramidParams
} from "../Interfaces";

const sides = 10;
const length = 20;
const height = 30;

const objParams: IPyramidParams = {
  sides,
  length,
  height
};
const operations: OperationsArray = [];
const viewOptions: IViewOptions = ObjectsCommon.createViewOptions();

/// CONSTRUCTOR TESTS

test("Pyramid - Constructor", () => {
  const obj = new Pyramid(objParams, operations, viewOptions);
  expect((obj as any).parameters).toEqual(objParams);
  expect((obj as any).operations).toEqual(operations);
  expect((obj as any).viewOptions).toEqual(viewOptions);
  const mesh: THREE.Mesh = (obj as any).mesh;
  expect(mesh).toBeInstanceOf(THREE.Mesh);
  expect(mesh.geometry).toBeInstanceOf(THREE.CylinderGeometry);
  expect(mesh.position).toEqual({ x: 0, y: 0, z: 0 });
  expect(mesh.rotation.x).toBeCloseTo(0);
  expect(mesh.rotation.y).toBeCloseTo(0);
  expect(mesh.rotation.z).toBeCloseTo(0);
});

test("Pyramid - Constructor - Default Params - ViewOptions", () => {
  const obj = new Pyramid(objParams, operations);
  expect((obj as any).parameters).toEqual(objParams);
  expect((obj as any).operations).toEqual(operations);
  expect((obj as any).viewOptions).toEqual(viewOptions);
  const mesh: THREE.Mesh = (obj as any).mesh;
  expect(mesh).toBeInstanceOf(THREE.Mesh);
  expect(mesh.geometry).toBeInstanceOf(THREE.CylinderGeometry);
  expect(mesh.position).toEqual({ x: 0, y: 0, z: 0 });
  expect(mesh.rotation.x).toBeCloseTo(0);
  expect(mesh.rotation.y).toBeCloseTo(0);
  expect(mesh.rotation.z).toBeCloseTo(0);
});

test("Pyramid - Constructor - Default Params - Operations - ViewOptions", () => {
  const obj = new Pyramid(objParams, operations);
  expect((obj as any).parameters).toEqual(objParams);
  expect((obj as any).operations).toEqual(operations);
  expect((obj as any).viewOptions).toEqual(viewOptions);

  const mesh: THREE.Mesh = (obj as any).mesh;
  expect(mesh).toBeInstanceOf(THREE.Mesh);
  expect(mesh.geometry).toBeInstanceOf(THREE.CylinderGeometry);
  expect(mesh.position).toEqual({ x: 0, y: 0, z: 0 });
  expect(mesh.rotation.x).toBeCloseTo(0);
  expect(mesh.rotation.y).toBeCloseTo(0);
  expect(mesh.rotation.z).toBeCloseTo(0);
});

test("Pyramid - Constructor - Set Operations - Translation", () => {
  const x = 10;
  const y = 20;
  const z = 30;
  // tslint:disable-next-line:no-shadowed-variable
  const operations = [ObjectsCommon.createTranslateOperation(x, y, z)];
  const obj = new Pyramid(objParams, operations);
  obj.computeMeshAsync();
  expect((obj as any).operations).toEqual(operations);

  return (obj as any).meshPromise.then((mesh: THREE.Mesh) => {
    expect(mesh).toBeInstanceOf(THREE.Mesh);
    expect(mesh.position).toEqual({ x, y, z });
    expect(mesh.rotation.x).toBeCloseTo(0);
    expect(mesh.rotation.y).toBeCloseTo(0);
    expect(mesh.rotation.z).toBeCloseTo(0);
  });
});

test("Pyramid - Constructor - Set Operations - Rotation", () => {
  const xangle = 45;
  const yangle = 35;
  const zangle = 15;
  // tslint:disable-next-line:no-shadowed-variable
  const operations = [
    ObjectsCommon.createRotateOperation(xangle, yangle, zangle)
  ];
  const obj = new Pyramid(objParams, operations);
  obj.computeMeshAsync();
  expect((obj as any).operations).toEqual(operations);

  return (obj as any).meshPromise.then((mesh: THREE.Mesh) => {
    expect(mesh).toBeInstanceOf(THREE.Mesh);
    expect(mesh.position).toEqual({ x: 0, y: 0, z: 0 });
    expect(mesh.rotation.x).toBeCloseTo((Math.PI * xangle) / 180);
    expect(mesh.rotation.y).toBeCloseTo((Math.PI * yangle) / 180);
    expect(mesh.rotation.z).toBeCloseTo((Math.PI * zangle) / 180);
  });
});

test("Pyramid - Constructor - set Mesh", async () => {
  const objAux = new Pyramid(objParams);
  const meshAux = await objAux.getMeshAsync();
  const obj = new Pyramid(
    objParams,
    operations,
    viewOptions,
    meshAux as THREE.Mesh
  );

  return obj.getMeshAsync().then(mesh => {
    expect(mesh).toBe(meshAux);
  });
});

/// END TESTING CONSTRUCTOR

/// TESTING CUBE.CLONE

test("Pyramid - Clone - Parameters - Operations - viewOptions", async () => {
  const obj = new Pyramid(objParams, operations, viewOptions);
  const spy = jest.spyOn((obj as any).mesh, "clone");
  const obj2 = obj.clone();
  expect((obj as any).parameters).toEqual((obj2 as any).parameters);
  expect((obj as any).operations).toEqual((obj2 as any).operations);
  expect((obj as any).viewOptions).toEqual((obj2 as any).viewOptions);
  // mesh clone should be called on this instance because obj has NOT been changed
  expect(spy).toBeCalledTimes(1);
});

/// TEST NEW FROM JSON
test("Pyramid - newFromJSON", () => {
  const obj = new Pyramid(objParams, operations, viewOptions);
  const json: IPyramidJSON = obj.toJSON() as IPyramidJSON;
  const obj2 = Pyramid.newFromJSON(json);
  expect(json.mesh).toBeUndefined();
  expect((obj as any).parameters).toEqual((obj2 as any).parameters);
  expect((obj as any).operations).toEqual((obj2 as any).operations);
  expect((obj as any).viewOptions).toEqual((obj2 as any).viewOptions);
});

test("Pyramid - newFromJSON", () => {
  const obj = new Pyramid(objParams, operations, viewOptions);
  const json: IPyramidJSON = obj.toJSON() as IPyramidJSON;
  json.type = "kkk";
  const obj2 = () => Pyramid.newFromJSON(json);
  expect(obj2).toThrowError();
});
