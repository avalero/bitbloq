import "jsdom-worker";
interface Global {
  fetch: any;
}
const global: Global = { fetch: undefined };
global.fetch = require("jest-fetch-mock");

import * as THREE from "three";
import Cylinder from "../Cylinder";
import ObjectsCommon from "../ObjectsCommon";

import {
  IViewOptions,
  OperationsArray,
  ICylinderJSON,
  ICylinderParams
} from "../Interfaces";

const r0 = 10;
const height = 15;
const r1 = 20;

const objParams: ICylinderParams = {
  r0,
  r1,
  height
};
const operations: OperationsArray = [];
const viewOptions: IViewOptions = ObjectsCommon.createViewOptions();

/// CONSTRUCTOR TESTS

test("Cylinder - Constructor", () => {
  const obj = new Cylinder(objParams, operations, viewOptions);
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

test("Cylinder - Constructor - Default Params - ViewOptions", () => {
  const obj = new Cylinder(objParams, operations);
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

test("Cylinder - Constructor - Default Params - Operations - ViewOptions", () => {
  const obj = new Cylinder(objParams, operations);
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

test("Cylinder - Constructor - Set Operations - Translation", () => {
  const x = 10;
  const y = 20;
  const z = 30;
  // tslint:disable-next-line:no-shadowed-variable
  const operations = [ObjectsCommon.createTranslateOperation(x, y, z)];
  const obj = new Cylinder(objParams, operations);
  expect((obj as any).operations).toEqual(operations);

  const mesh: THREE.Mesh = (obj as any).mesh;
  expect(mesh).toBeInstanceOf(THREE.Mesh);
  expect(mesh.position).toEqual({ x, y, z });
  expect(mesh.rotation.x).toBeCloseTo(0);
  expect(mesh.rotation.y).toBeCloseTo(0);
  expect(mesh.rotation.z).toBeCloseTo(0);
});

test("Cylinder - Constructor - Set Operations - Rotation", () => {
  const xangle = 45;
  const yangle = 35;
  const zangle = 15;
  // tslint:disable-next-line:no-shadowed-variable
  const operations = [
    ObjectsCommon.createRotateOperation(xangle, yangle, zangle)
  ];
  const obj = new Cylinder(objParams, operations);
  expect((obj as any).operations).toEqual(operations);

  const mesh: THREE.Mesh = (obj as any).mesh;
  expect(mesh).toBeInstanceOf(THREE.Mesh);
  expect(mesh.position).toEqual({ x: 0, y: 0, z: 0 });
  expect(mesh.rotation.x).toBeCloseTo((Math.PI * xangle) / 180);
  expect(mesh.rotation.y).toBeCloseTo((Math.PI * yangle) / 180);
  expect(mesh.rotation.z).toBeCloseTo((Math.PI * zangle) / 180);
});

test("Cylinder - Constructor - set Mesh", async () => {
  const objAux = new Cylinder(objParams);
  const meshAux = await objAux.getMeshAsync();
  const obj = new Cylinder(
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

test("Cylinder - Clone - Parameters - Operations - viewOptions", async () => {
  const obj = new Cylinder(objParams, operations, viewOptions);
  const spy = jest.spyOn((obj as any).mesh, "clone");
  const obj2 = obj.clone();
  expect((obj as any).parameters).toEqual((obj2 as any).parameters);
  expect((obj as any).operations).toEqual((obj2 as any).operations);
  expect((obj as any).viewOptions).toEqual((obj2 as any).viewOptions);
  // mesh clone should be called on this instance because obj has NOT been changed
  expect(spy).toBeCalledTimes(1);
});

/// TEST NEW FROM JSON
test("Cylinder - newFromJSON", () => {
  const obj = new Cylinder(objParams, operations, viewOptions);
  const json: ICylinderJSON = obj.toJSON() as ICylinderJSON;
  const obj2 = Cylinder.newFromJSON(json);
  expect(json.mesh).toBeUndefined();
  expect((obj as any).parameters).toEqual((obj2 as any).parameters);
  expect((obj as any).operations).toEqual((obj2 as any).operations);
  expect((obj as any).viewOptions).toEqual((obj2 as any).viewOptions);
});

test("Cylinder - newFromJSON", () => {
  const obj = new Cylinder(objParams, operations, viewOptions);
  const json: ICylinderJSON = obj.toJSON() as ICylinderJSON;
  json.type = "kkk";
  const obj2 = () => Cylinder.newFromJSON(json);
  expect(obj2).toThrowError();
});
