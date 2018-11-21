import ObjectsGroups from '../ObjectsGroup';

import Cube from '../Cube';
import Sphere from '../Sphere';
import Cylinder from '../Cylinder';
import * as THREE from 'three';
import Object3D from '../Object3D';

const radius = 5;
const width = 7;
const height = 5;
const depth = 10;
const r0 = 10;
const r1 = 5;

test('Check addition of objects to Group', () => {
  const object1 = new Cube({ width, height, depth });
  const object2 = new Sphere({ radius });
  const object3 = new Cylinder({ r0, r1, height });

  const group = new ObjectsGroups([object1, object2, object3]);

  return group.getMeshAsync().then(meshGroup => {
    expect(meshGroup.children.length).toBe(3);
  });
});

test('Check translation of group', () => {
  const x = 10;
  const y = 5;
  const z = -5;
  const object1 = new Cube({ width, height, depth });
  const object2 = new Sphere({ radius });
  const object3 = new Cylinder({ r0, r1, height });

  const group = new ObjectsGroups([object1, object2, object3]);
  group.setOperations([{ type: 'translation', x, y, z, relative: false }]);

  return group.getMeshAsync().then(meshGroup => {
    meshGroup.children.forEach(mesh => {
      expect(mesh.position).toEqual({ x, y, z });
    });
  });
});

test('Check rotation of group', () => {
  const angle = Math.PI / 3;
  const object1 = new Cube({ width, height, depth });
  const object2 = new Sphere({ radius });
  const object3 = new Cylinder({ r0, r1, height });

  const group = new ObjectsGroups([object1, object2, object3]);
  group.setOperations([
    { type: 'rotation', axis: 'x', angle, relative: false },
  ]);
  return group.getMeshAsync().then(meshGroup => {
    meshGroup.children.forEach(mesh => {
      expect(mesh.position).toEqual({ x: 0, y: 0, z: 0 });
      expect(mesh.rotation.x).toBeCloseTo(0.018277045187202513);
    });
  });
});

test('Check several rotations of group', () => {
  const angle = Math.PI / 3;
  const object1 = new Cube({ width, height, depth });
  const object2 = new Sphere({ radius });
  const object3 = new Cylinder({ r0, r1, height });

  const group = new ObjectsGroups([object1, object2, object3]);
  group.setOperations([
    { type: 'rotation', axis: 'x', angle, relative: false },
    { type: 'rotation', axis: 'y', angle, relative: false },
  ]);
  return group.getMeshAsync().then(meshGroup => {
    meshGroup.children.forEach(mesh => {
      expect(mesh.position).toEqual({ x: 0, y: 0, z: 0 });
      expect(mesh.rotation.x).toBeCloseTo(0.018277045187202513);
      expect(mesh.rotation.y).toBeCloseTo(0.018277045187202513);
      expect(mesh.rotation.z).toBeCloseTo(0);
    });
  });
});

test('Check translation and rotation', () => {
  const x = 10;
  const y = 5;
  const z = -5;
  const angle = Math.PI / 3;
  const object1 = new Cube({ width, height, depth });
  const object2 = new Sphere({ radius });
  const object3 = new Cylinder({ r0, r1, height });

  const group = new ObjectsGroups([object1, object2, object3]);
  group.setOperations([
    { type: 'rotation', axis: 'x', angle, relative: false },
    { type: 'translation', x, y, z, relative: true },
  ]);
  return group.getMeshAsync().then(meshGroup => {
    meshGroup.children.forEach(mesh => {
      expect(mesh.position.x).toBeCloseTo(10);
      expect(mesh.position.y).toBeCloseTo(5.09);
      expect(mesh.position.z).toBeCloseTo(-4.907);
      expect(mesh.rotation.x).toBeCloseTo(0.018277045187202513);
    });
  });
});

test('Check ungroup', () => {
  const x = 10;
  const y = 5;
  const z = -5;
  const angle = Math.PI / 3;
  const object1 = new Cube({ width, height, depth });
  const object2 = new Sphere({ radius });
  const object3 = new Cylinder({ r0, r1, height });

  const group = new ObjectsGroups([object1, object2, object3]);
  group.setOperations([
    { type: 'rotation', axis: 'x', angle, relative: false },
    { type: 'translation', x, y, z, relative: true },
  ]);
  const objects: Array<Object3D> = group.unGroup();
  const object: Object3D = objects[0];
  return object.getMeshAsync().then(mesh => {
    expect(mesh.position.x).toBeCloseTo(10);
    expect(mesh.position.y).toBeCloseTo(5.09);
    expect(mesh.position.z).toBeCloseTo(-4.907);
    expect(mesh.rotation.x).toBeCloseTo(0.018277045187202513);
  });
});

test('Check ungroup with prior', () => {
  const x = 10;
  const y = 5;
  const z = -5;
  const object1 = new Cube({ width, height, depth });
  object1.setOperations([{ type: 'translation', x, y, z, relative: false }]);
  const object2 = new Sphere({ radius });
  const object3 = new Cylinder({ r0, r1, height });

  const group = new ObjectsGroups([object1, object2, object3]);
  group.setOperations([{ type: 'translation', x, y, z, relative: false }]);
  const objects: Array<Object3D> = group.unGroup();
  const object: Object3D = objects[0];
  return object.getMeshAsync().then(mesh => {
    expect(mesh.position.x).toBe(2 * x);
    expect(mesh.position.y).toBe(2 * y);
    expect(mesh.position.z).toBe(2 * z);
  });
});

test('Check ungroup with other prior', () => {
  const x = 10;
  const y = 5;
  const z = -5;
  const object1 = new Cube({ width, height, depth });
  object1.setOperations([{ type: 'translation', x, y, z, relative: false }]);
  const object2 = new Sphere({ radius });
  const object3 = new Cylinder({ r0, r1, height });

  const group = new ObjectsGroups([object1, object2, object3]);
  group.setOperations([{ type: 'translation', x, y, z, relative: false }]);
  const objects: Array<Object3D> = group.unGroup();
  const object: Object3D = objects[1];
  return object.getMeshAsync().then(mesh => {
    expect(mesh.position.x).toBe(x);
    expect(mesh.position.y).toBe(y);
    expect(mesh.position.z).toBe(z);
  });
});
