import Cube, { ICubeJSON, ICubeParams } from '../Cube';
import ObjectsCommon, { OperationsArray, IViewOptions } from '../ObjectsCommon';
import * as THREE from 'three';

const width = 10;
const height = 15;
const depth = 20;

let cubeParams: ICubeParams = {
  width,
  height,
  depth,
};
let operations: OperationsArray = [];
let viewOptions: IViewOptions = ObjectsCommon.createViewOptions();

/// CONSTRUCTOR TESTS

test('Cube - Constructor', () => {
  const obj = new Cube(cubeParams, operations, viewOptions);
  expect((obj as any).parameters).toEqual(cubeParams);
  expect((obj as any).operations).toEqual(operations);
  expect((obj as any).viewOptions).toEqual(viewOptions);
  expect((obj as any).lastJSON).toEqual(obj.toJSON());
  return (obj as any).meshPromise.then((mesh: THREE.Mesh) => {
    expect(mesh).toBeInstanceOf(THREE.Mesh);
    expect(mesh.geometry).toBeInstanceOf(THREE.CubeGeometry);
    expect(mesh.position).toEqual({ x: 0, y: 0, z: 0 });
    expect(mesh.rotation.x).toBeCloseTo(0);
    expect(mesh.rotation.y).toBeCloseTo(0);
    expect(mesh.rotation.z).toBeCloseTo(0);
  });
});

test('Cube - Constructor - Default Params - ViewOptions', () => {
  const obj = new Cube(cubeParams, operations);
  expect((obj as any).parameters).toEqual(cubeParams);
  expect((obj as any).operations).toEqual(operations);
  expect((obj as any).viewOptions).toEqual(viewOptions);
  expect((obj as any).lastJSON).toEqual(obj.toJSON());
  return (obj as any).meshPromise.then((mesh: THREE.Mesh) => {
    expect(mesh).toBeInstanceOf(THREE.Mesh);
    expect(mesh.geometry).toBeInstanceOf(THREE.CubeGeometry);
    expect(mesh.position).toEqual({ x: 0, y: 0, z: 0 });
    expect(mesh.rotation.x).toBeCloseTo(0);
    expect(mesh.rotation.y).toBeCloseTo(0);
    expect(mesh.rotation.z).toBeCloseTo(0);
  });
});

test('Cube - Constructor - Default Params - Operations - ViewOptions', () => {
  const obj = new Cube(cubeParams, operations);
  expect((obj as any).parameters).toEqual(cubeParams);
  expect((obj as any).operations).toEqual(operations);
  expect((obj as any).viewOptions).toEqual(viewOptions);
  expect((obj as any).lastJSON).toEqual(obj.toJSON());
  return (obj as any).meshPromise.then((mesh: THREE.Mesh) => {
    expect(mesh).toBeInstanceOf(THREE.Mesh);
    expect(mesh.geometry).toBeInstanceOf(THREE.CubeGeometry);
    expect(mesh.position).toEqual({ x: 0, y: 0, z: 0 });
    expect(mesh.rotation.x).toBeCloseTo(0);
    expect(mesh.rotation.y).toBeCloseTo(0);
    expect(mesh.rotation.z).toBeCloseTo(0);
  });
});

test('Cube - Constructor - Set Operations - Translation', () => {
  const x = 10;
  const y = 20;
  const z = 30;
  const operations = [ObjectsCommon.createTranslateOperation(x, y, z)];
  const obj = new Cube(cubeParams, operations);
  expect((obj as any).operations).toEqual(operations);
  expect((obj as any).lastJSON).toEqual(obj.toJSON());
  return (obj as any).meshPromise.then((mesh: THREE.Mesh) => {
    expect(mesh).toBeInstanceOf(THREE.Mesh);
    expect(mesh.position).toEqual({ x, y, z });
    expect(mesh.rotation.x).toBeCloseTo(0);
    expect(mesh.rotation.y).toBeCloseTo(0);
    expect(mesh.rotation.z).toBeCloseTo(0);
  });
});

test('Cube - Constructor - Set Operations - Rotation', () => {
  const axis = 'y';
  const angle = 45;
  const operations = [ObjectsCommon.createRotateOperation(axis, angle)];
  const obj = new Cube(cubeParams, operations);
  expect((obj as any).operations).toEqual(operations);
  expect((obj as any).lastJSON).toEqual(obj.toJSON());
  return (obj as any).meshPromise.then((mesh: THREE.Mesh) => {
    expect(mesh).toBeInstanceOf(THREE.Mesh);
    expect(mesh.position).toEqual({ x: 0, y: 0, z: 0 });
    expect(mesh.rotation.x).toBeCloseTo(0);
    expect(mesh.rotation.y).toBeCloseTo((Math.PI * angle) / 180);
    expect(mesh.rotation.z).toBeCloseTo(0);
  });
});

test('Cube - Constructor - set Mesh', async () => {
  const objAux = new Cube(cubeParams);
  const meshAux = await objAux.getMeshAsync();
  const obj = new Cube(cubeParams, operations, viewOptions, meshAux);
  return obj.getMeshAsync().then(mesh => {
    expect(mesh).toBe(meshAux);
  });
});

/// END TESTING CONSTRUCTOR

/// TESTING CUBE.CLONE

test('Cube - Clone - Parameters - Operations - viewOptions', async () => {
  const obj = new Cube(cubeParams, operations, viewOptions);
  const spy = jest.spyOn((obj as any).mesh, 'clone');
  const obj2 = obj.clone();
  expect((obj as any).parameters).toEqual((obj2 as any).parameters);
  expect((obj as any).operations).toEqual((obj2 as any).operations);
  expect((obj as any).viewOptions).toEqual((obj2 as any).viewOptions);
  // mesh clone should be called on this instance because obj has NOT been changed
  expect(spy).toBeCalledTimes(1);

  (obj as any).operations = [ObjectsCommon.createTranslateOperation(0, 0, 0)];
  const obj3 = obj.clone();
  // mesh clone should not be called on this instance because obj has been changed
  expect(spy).toBeCalledTimes(1);
});
