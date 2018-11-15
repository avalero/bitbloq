import Sphere from '../Sphere';
import * as THREE from 'three';

const radius = 10;

test('Check initial position and rotation', () => {
  const object = new Sphere(({radius}));
  const mesh = object.getPrimitiveMeshAsync();
  const center = mesh.position;
  const euler = mesh.rotation;
  expect(center).toEqual(new THREE.Vector3(0,0,0));
  expect(euler.x).toBeCloseTo(0);
  expect(euler.y).toBeCloseTo(0);
  expect(euler.z).toBeCloseTo(0);
});

test('Test translation', () => {
  const x = 10; const y = 5; const z = -5;
  const object = new Sphere(({radius}));
  object.setOperations([{type:'translation', x, y, z, relative:false}]);
  expect(object.meshUpdateRequired).toBe(false);
  expect(object.pendingOperation).toBe(true);
  let mesh:THREE.Mesh = object.getPrimitiveMeshAsync();
  expect(mesh.position).toEqual({x, y, z});
  object.setOperations([{type:'translation', x, y, z, relative:false}]);
  expect(object.meshUpdateRequired).toBe(false);
  expect(object.pendingOperation).toBe(false);
  object.setOperations([{type:'translation', x, y, z, relative:false},{type:'translation', x, y, z, relative:false}]);
  expect(object.meshUpdateRequired).toBe(false);
  expect(object.pendingOperation).toBe(true);
  mesh = object.getPrimitiveMeshAsync();
  expect(mesh.position).toEqual({x:2*x, y:2*y, z:2*z});  
});


test('Test rotation', () => {
  const angle = Math.PI/3;
  const object = new Sphere(({radius}));
  object.setOperations([{type:'rotation', axis: 'x', angle, relative:false }]);
  expect(object.meshUpdateRequired).toBe(false);
  expect(object.pendingOperation).toBe(true);
  let mesh:THREE.Mesh = object.getPrimitiveMeshAsync();
  expect(mesh.position).toEqual({x:0, y:0, z:0});
  expect(mesh.rotation.x).toBeCloseTo(0.018277045187202513);

  object.setOperations([{type:'rotation', axis: 'x', angle, relative:false }]);
  expect(object.meshUpdateRequired).toBe(false);
  expect(object.pendingOperation).toBe(false);
  mesh = object.getPrimitiveMeshAsync();
  expect(mesh.position).toEqual({x:0, y:0, z:0});
  expect(mesh.rotation.x).toBeCloseTo(0.018277045187202513);

  object.setOperations([{type:'rotation', axis: 'x', angle, relative:false }, {type:'rotation', axis: 'y', angle, relative:false }]);
  expect(object.meshUpdateRequired).toBe(false);
  expect(object.pendingOperation).toBe(true);
  mesh = object.getPrimitiveMeshAsync();
  expect(mesh.position).toEqual({x:0, y:0, z:0});
  expect(mesh.rotation.x).toBeCloseTo(0.018277045187202513);
  expect(mesh.rotation.y).toBeCloseTo(0.018277045187202513);
  expect(mesh.rotation.z).toBeCloseTo(0);
});

test('Test translation & rotation', () => {
  const x = 10; const y = 5; const z = -5;
  const angle = Math.PI/3;
  const object = new Sphere(({radius}));
  object.setOperations([{type:'rotation', axis: 'x', angle, relative:false }]);
  expect(object.meshUpdateRequired).toBe(false);
  expect(object.pendingOperation).toBe(true);
  let mesh:THREE.Mesh = object.getPrimitiveMeshAsync();
  expect(mesh.position).toEqual({x:0, y:0, z:0});
  expect(mesh.rotation.x).toBeCloseTo(0.018277045187202513);

  object.setOperations([{type:'rotation', axis: 'x', angle, relative:false }, {type:'translation', x, y, z, relative:false}]);
  expect(object.meshUpdateRequired).toBe(false);
  expect(object.pendingOperation).toBe(true);
  mesh = object.getPrimitiveMeshAsync();
  expect(mesh.position).toEqual({x, y, z});
  expect(mesh.rotation.x).toBeCloseTo(0.018277045187202513);

  object.setOperations([{type:'rotation', axis: 'x', angle, relative:false }, {type:'translation', x, y, z, relative:true}]);
  expect(object.meshUpdateRequired).toBe(false);
  expect(object.pendingOperation).toBe(true);
  mesh = object.getPrimitiveMeshAsync();
  expect(mesh.position.x).toBeCloseTo(10);
  expect(mesh.position.y).toBeCloseTo(5.09);
  expect(mesh.position.z).toBeCloseTo(-4.907);
  expect(mesh.rotation.x).toBeCloseTo(0.018277045187202513);

  object.setOperations([{type:'rotation', axis: 'x', angle, relative:false }, {type:'rotation', axis: 'y', angle, relative:true }]);
  expect(object.meshUpdateRequired).toBe(false);
  expect(object.pendingOperation).toBe(true);
  mesh = object.getPrimitiveMeshAsync();
  expect(mesh.rotation.x).toBeCloseTo(0.0182);
  expect(mesh.rotation.y).toBeCloseTo(0.0182);
  expect(mesh.rotation.z).toBeCloseTo(0);
});