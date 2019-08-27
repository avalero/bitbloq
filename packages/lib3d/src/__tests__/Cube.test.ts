import "jsdom-worker";
interface Global {
  fetch: any;
}
const global: Global = { fetch: undefined };
global.fetch = require("jest-fetch-mock");

import * as THREE from "three";
import Cube from "../Cube";
import ObjectsCommon from "../ObjectsCommon";
import {
  ICubeJSON,
  ICubeParams,
  ITranslateOperation,
  IViewOptions,
  OperationsArray
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

/// CONSTRUCTOR TESTS

test("Cube - Constructor - Default Params", () => {
  const obj = new Cube(objParams);
  expect((obj as any).operations).toEqual([]);
  expect((obj as any).viewOptions).toEqual(ObjectsCommon.createViewOptions());
});

test("Cube - Constructor", () => {
  const obj = new Cube(objParams, operations, viewOptions);
  expect((obj as any).parameters).toEqual(objParams);
  expect((obj as any).operations).toEqual(operations);
  expect((obj as any).viewOptions).toEqual(viewOptions);

  const mesh: THREE.Mesh = (obj as any).mesh;
  expect(mesh).toBeInstanceOf(THREE.Mesh);
  expect(mesh.geometry).toBeInstanceOf(THREE.CubeGeometry);
  expect(mesh.position).toEqual({ x: 0, y: 0, z: 0 });
  expect(mesh.rotation.x).toBeCloseTo(0);
  expect(mesh.rotation.y).toBeCloseTo(0);
  expect(mesh.rotation.z).toBeCloseTo(0);
});

test("Cube - Constructor - Default Params - ViewOptions", () => {
  const obj = new Cube(objParams, operations);
  expect((obj as any).parameters).toEqual(objParams);
  expect((obj as any).operations).toEqual(operations);
  expect((obj as any).viewOptions).toEqual(viewOptions);

  const mesh: THREE.Mesh = (obj as any).mesh;
  expect(mesh).toBeInstanceOf(THREE.Mesh);
  expect(mesh.geometry).toBeInstanceOf(THREE.CubeGeometry);
  expect(mesh.position).toEqual({ x: 0, y: 0, z: 0 });
  expect(mesh.rotation.x).toBeCloseTo(0);
  expect(mesh.rotation.y).toBeCloseTo(0);
  expect(mesh.rotation.z).toBeCloseTo(0);
});

test("Cube - Constructor - Default Params - Operations - ViewOptions", () => {
  const obj = new Cube(objParams, operations);
  expect((obj as any).parameters).toEqual(objParams);
  expect((obj as any).operations).toEqual(operations);
  expect((obj as any).viewOptions).toEqual(viewOptions);

  const mesh: THREE.Mesh = (obj as any).mesh;
  expect(mesh).toBeInstanceOf(THREE.Mesh);
  expect(mesh.geometry).toBeInstanceOf(THREE.CubeGeometry);
  expect(mesh.position).toEqual({ x: 0, y: 0, z: 0 });
  expect(mesh.rotation.x).toBeCloseTo(0);
  expect(mesh.rotation.y).toBeCloseTo(0);
  expect(mesh.rotation.z).toBeCloseTo(0);
});

test("Cube - Constructor - Set Operations - Translation", () => {
  const x = 10;
  const y = 20;
  const z = 30;
  // tslint:disable-next-line:no-shadowed-variable
  const operations: ITranslateOperation[] = [
    ObjectsCommon.createTranslateOperation(x, y, z)
  ];
  const obj = new Cube(objParams, operations);
  expect((obj as any).operations).toEqual(operations);

  const mesh: THREE.Mesh = (obj as any).mesh;
  expect(mesh).toBeInstanceOf(THREE.Mesh);
  expect(mesh.position).toEqual({ x, y, z });
  expect(mesh.rotation.x).toBeCloseTo(0);
  expect(mesh.rotation.y).toBeCloseTo(0);
  expect(mesh.rotation.z).toBeCloseTo(0);
});

test("Cube - Constructor - Set Operations - Rotation", () => {
  const xangle = 45;
  const yangle = 35;
  const zangle = 15;
  // tslint:disable-next-line:no-shadowed-variable
  const operations = [
    ObjectsCommon.createRotateOperation(xangle, yangle, zangle)
  ];
  const obj = new Cube(objParams, operations);
  expect((obj as any).operations).toEqual(operations);

  const mesh: THREE.Mesh = (obj as any).mesh;
  expect(mesh).toBeInstanceOf(THREE.Mesh);
  expect(mesh.position).toEqual({ x: 0, y: 0, z: 0 });
  expect(mesh.rotation.x).toBeCloseTo((Math.PI * xangle) / 180);
  expect(mesh.rotation.y).toBeCloseTo((Math.PI * yangle) / 180);
  expect(mesh.rotation.z).toBeCloseTo((Math.PI * zangle) / 180);
});

test("Cube - Constructor - set Mesh", async () => {
  const objAux = new Cube(objParams);
  const meshAux = await objAux.getMeshAsync();
  const obj = new Cube(
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
test("Cube - Clone - Parameters - Operations - viewOptions", async () => {
  const obj = new Cube(objParams, operations, viewOptions);
  const spy = jest.spyOn((obj as any).mesh, "clone");
  const obj2 = obj.clone();
  expect((obj as any).parameters).toEqual((obj2 as any).parameters);
  expect((obj as any).operations).toEqual((obj2 as any).operations);
  expect((obj as any).viewOptions).toEqual((obj2 as any).viewOptions);
  // mesh clone should be called on this instance because obj has NOT been changed
  expect(spy).toBeCalledTimes(1);
});

/// END CLONE

/// TEST NEW FROM JSON
test("Cube - newFromJSON", async () => {
  const obj = new Cube(objParams, operations, viewOptions);
  const json: ICubeJSON = obj.toJSON() as ICubeJSON;
  const obj2 = Cube.newFromJSON(json);
  expect((obj as any).parameters).toEqual((obj2 as any).parameters);
  expect((obj as any).operations).toEqual((obj2 as any).operations);
  expect((obj as any).viewOptions).toEqual((obj2 as any).viewOptions);
});

test("Cube - newFromJSON - invalid type", () => {
  const obj = new Cube(objParams, operations, viewOptions);
  const json: ICubeJSON = obj.toJSON() as ICubeJSON;
  json.type = "kkk";
  const obj2 = () => Cube.newFromJSON(json);
  expect(obj2).toThrowError();
});

test("Cube - newFromJSON - with mesh", async () => {
  const obj = new Cube(objParams, operations, viewOptions);
  const json: ICubeJSON = obj.toJSON() as ICubeJSON;
  expect(json.mesh).toBeUndefined();
  const obj2 = Cube.newFromJSON(json);
});
