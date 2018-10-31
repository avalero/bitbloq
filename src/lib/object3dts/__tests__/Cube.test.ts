import Cube from '../Cube';
import * as THREE from 'three';

const width = 10;
const height = 20;
const depth = 30;

test('Check params are well passed', () =>{
  const object = new Cube({width, height, depth});
  expect((object as any).parameters.width).toBe(width);
  expect((object as any).parameters.height).toBe(height);
  expect((object as any).parameters.depth).toBe(depth);
});

test('Check there are no initial operations', () =>{
  const object = new Cube({width, height, depth});
  expect((object as any).operations).toEqual([]);
});

test('Check mesh needs to be computed', () => {
  const object = new Cube({width, height, depth});
  expect(object.updateRequired).toBe(false); //does not need to be computed after creation
});


test('Check params are well passed and mesh needs to be recomputed', () =>{
  // Update parameters to same value to check if updateRequired switches to true
  const object = new Cube({width, height, depth});
  object.setParameters({width:5, height:5, depth:5});
  expect((object as any).parameters).toEqual({width:5, height:5, depth:5});
  expect(object.updateRequired).toBe(true);
  const mesh1 = object.getPrimitiveMesh();
  expect(object.updateRequired).toBe(false);
  const mesh2 = object.getPrimitiveMesh();
  expect(mesh1).toBe(mesh2);
});


test('Check mesh needs to be computed only once', () => {
  const object = new Cube({width, height, depth});
  expect(object.updateRequired).toBe(false);
  object.setParameters({width, height, depth});
  expect((object as any).parameters).toEqual({width, height, depth});
  expect(object.updateRequired).toBe(false);
});

test('Check Object Dimensions are well Constructed', () =>{
  const object = new Cube({width, height, depth});
  const mesh = object.getPrimitiveMesh();
  const boundingBoxDims:THREE.Vector3 = new THREE.Vector3();
  new THREE.Box3().setFromObject(mesh).getSize(boundingBoxDims);
  expect(boundingBoxDims).toEqual({x:width, y:depth, z:height});
});

test('Check initial position and rotation', () => {
  const object = new Cube({width, height, depth});
  const mesh = object.getPrimitiveMesh();
  const center = mesh.position;
  const euler = mesh.rotation;
  expect(center).toEqual(new THREE.Vector3(0,0,0));
  expect(euler.x).toBeCloseTo(0);
  expect(euler.y).toBeCloseTo(0);
  expect(euler.z).toBeCloseTo(0);
});


// ASYNC TESTS

test('Async Check params are well passed and mesh needs to be recomputed', () =>{
  // Update parameters to same value to check if updateRequired switches to true
  const object = new Cube({width, height, depth});
  object.setParameters({width:5, height:5, depth:5});
  expect((object as any).parameters).toEqual({width:5, height:5, depth:5});
  expect(object.updateRequired).toBe(true);

  return object.getMeshAsync().then( mesh1 => {
    expect(object.updateRequired).toBe(false);
    return object.getMeshAsync().then ( mesh2 => {
      expect(mesh1).toBe(mesh2);
    });
  });
});

test('Async Check Object Dimensions are well Constructed', () =>{
  const object = new Cube({width, height, depth});
  return object.getMeshAsync().then( mesh => {
    const boundingBoxDims:THREE.Vector3 = new THREE.Vector3();
    new THREE.Box3().setFromObject(mesh).getSize(boundingBoxDims);
    expect(boundingBoxDims).toEqual({x:width, y:depth, z:height});
  }); 
});

test('Async Check initial position and rotation', () => {
  const object = new Cube({width, height, depth});
  return object.getMeshAsync().then( mesh =>{
    const center = mesh.position;
    const euler = mesh.rotation;
    expect(center).toEqual(new THREE.Vector3(0,0,0));
    expect(euler.x).toBeCloseTo(0);
    expect(euler.y).toBeCloseTo(0);
    expect(euler.z).toBeCloseTo(0);
  });
});