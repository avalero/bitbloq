import "jsdom-worker";
interface Global {
  fetch: any;
}
const global: Global = { fetch: undefined };
global.fetch = require("jest-fetch-mock");

import * as THREE from "three";
import ObjectsCommon from "../ObjectsCommon";
import Sphere from "../Sphere";

import {
  IViewOptions,
  OperationsArray,
  ISphereJSON,
  ISphereParams
} from "../Interfaces";

const radius = 10;

const objParams: ISphereParams = {
  radius
};
const operations: OperationsArray = [];
const viewOptions: IViewOptions = ObjectsCommon.createViewOptions();

/// CONSTRUCTOR TESTS

test("Sphere - Constructor", () => {
  const obj = new Sphere(objParams, operations, viewOptions);
  expect((obj as any).parameters).toEqual(objParams);
  expect((obj as any).operations).toEqual(operations);
  expect((obj as any).viewOptions).toEqual(viewOptions);

  const mesh: THREE.Mesh = (obj as any).mesh;
  expect(mesh).toBeInstanceOf(THREE.Mesh);
  expect(mesh.geometry).toBeInstanceOf(THREE.SphereGeometry);
  expect(mesh.position).toEqual({ x: 0, y: 0, z: 0 });
  expect(mesh.rotation.x).toBeCloseTo(0);
  expect(mesh.rotation.y).toBeCloseTo(0);
  expect(mesh.rotation.z).toBeCloseTo(0);
});

test("Sphere - Constructor - Default Params - ViewOptions", () => {
  const obj = new Sphere(objParams, operations);
  expect((obj as any).parameters).toEqual(objParams);
  expect((obj as any).operations).toEqual(operations);
  expect((obj as any).viewOptions).toEqual(viewOptions);

  const mesh: THREE.Mesh = (obj as any).mesh;
  expect(mesh).toBeInstanceOf(THREE.Mesh);
  expect(mesh.geometry).toBeInstanceOf(THREE.SphereGeometry);
  expect(mesh.position).toEqual({ x: 0, y: 0, z: 0 });
  expect(mesh.rotation.x).toBeCloseTo(0);
  expect(mesh.rotation.y).toBeCloseTo(0);
  expect(mesh.rotation.z).toBeCloseTo(0);
});

test("Sphere - Constructor - Default Params - Operations - ViewOptions", () => {
  const obj = new Sphere(objParams, operations);
  expect((obj as any).parameters).toEqual(objParams);
  expect((obj as any).operations).toEqual(operations);
  expect((obj as any).viewOptions).toEqual(viewOptions);

  const mesh: THREE.Mesh = (obj as any).mesh;
  expect(mesh).toBeInstanceOf(THREE.Mesh);
  expect(mesh.geometry).toBeInstanceOf(THREE.SphereGeometry);
  expect(mesh.position).toEqual({ x: 0, y: 0, z: 0 });
  expect(mesh.rotation.x).toBeCloseTo(0);
  expect(mesh.rotation.y).toBeCloseTo(0);
  expect(mesh.rotation.z).toBeCloseTo(0);
});

test("Sphere - Constructor - Set Operations - Translation", () => {
  const x = 10;
  const y = 20;
  const z = 30;
  const operationsArr = [ObjectsCommon.createTranslateOperation(x, y, z)];
  const obj = new Sphere(objParams, operationsArr);
  expect((obj as any).operations).toEqual(operationsArr);

  const mesh: THREE.Mesh = (obj as any).mesh;
  expect(mesh).toBeInstanceOf(THREE.Mesh);
  expect(mesh.position).toEqual({ x, y, z });
  expect(mesh.rotation.x).toBeCloseTo(0);
  expect(mesh.rotation.y).toBeCloseTo(0);
  expect(mesh.rotation.z).toBeCloseTo(0);
});

test("Sphere - Constructor - Set Operations - Rotation", () => {
  const xangle = 45;
  const yangle = 35;
  const zangle = 15;
  const operationsArr = [
    ObjectsCommon.createRotateOperation(xangle, yangle, zangle)
  ];
  const obj = new Sphere(objParams, operationsArr);
  expect((obj as any).operations).toEqual(operationsArr);

  const mesh: THREE.Mesh = (obj as any).mesh;
  expect(mesh).toBeInstanceOf(THREE.Mesh);
  expect(mesh.position).toEqual({ x: 0, y: 0, z: 0 });
  expect(mesh.rotation.x).toBeCloseTo((Math.PI * xangle) / 180);
  expect(mesh.rotation.y).toBeCloseTo((Math.PI * yangle) / 180);
  expect(mesh.rotation.z).toBeCloseTo((Math.PI * zangle) / 180);
});

test("Sphere - Constructor - set Mesh", async () => {
  const objAux = new Sphere(objParams);
  const meshAux = await objAux.getMeshAsync();
  const obj = new Sphere(
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

test("Sphere - Clone - Parameters - Operations - viewOptions", async () => {
  const obj = new Sphere(objParams, operations, viewOptions);
  const spy = jest.spyOn((obj as any).mesh, "clone");
  const obj2 = obj.clone();
  expect((obj as any).parameters).toEqual((obj2 as any).parameters);
  expect((obj as any).operations).toEqual((obj2 as any).operations);
  expect((obj as any).viewOptions).toEqual((obj2 as any).viewOptions);
  // mesh clone should be called on this instance because obj has NOT been changed
  expect(spy).toBeCalledTimes(1);
});

/// TEST NEW FROM JSON
test("Sphere - newFromJSON", async () => {
  const obj = new Sphere(objParams, operations, viewOptions);
  const json: ISphereJSON = obj.toJSON() as ISphereJSON;
  const obj2 = Sphere.newFromJSON(json);
  expect(json.mesh).toBeUndefined();
  expect((obj as any).parameters).toEqual((obj2 as any).parameters);
  expect((obj as any).operations).toEqual((obj2 as any).operations);
  expect((obj as any).viewOptions).toEqual((obj2 as any).viewOptions);
});

test("Sphere - newFromJSON", async () => {
  const obj = new Sphere(objParams, operations, viewOptions);
  const json: ISphereJSON = obj.toJSON() as ISphereJSON;
  json.type = "kkk";
  const obj2 = () => Sphere.newFromJSON(json);
  expect(obj2).toThrowError();
});
