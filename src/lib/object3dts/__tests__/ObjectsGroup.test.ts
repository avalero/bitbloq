import ObjectsGroups from '../ObjectsGroup';

import Cube from '../Cube';
import Sphere from '../Sphere';
import Cylinder from '../Cylinder';
import * as THREE from 'three';
import Object3D from '../Object3D';
import Scene from '../Scene';
import ObjectsCommon from '../ObjectsCommon';

const radius = 5;
const width = 7;
const height = 5;
const depth = 10;
const r0 = 10;
const r1 = 5;

test('Check addition of objects to Group', () => {
  const scene = new Scene();
  const object1Aux = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(),
    scene,
  );
  const object2Aux = new Sphere(
    { radius },
    [],
    ObjectsCommon.createViewOptions(),
    scene,
  );
  const object3Aux = new Cylinder(
    { r0, r1, height },
    [],
    ObjectsCommon.createViewOptions(),
    scene,
  );

  scene.addNewObjectFromJSON(object1Aux.toJSON());
  const object1 = (scene as any).BitbloqScene[0];
  scene.addNewObjectFromJSON(object2Aux.toJSON());
  const object2 = (scene as any).BitbloqScene[1];
  scene.addNewObjectFromJSON(object3Aux.toJSON());
  const object3 = (scene as any).BitbloqScene[2];

  const group = new ObjectsGroups([object1, object2, object3], scene);

  return group.getMeshAsync().then(meshGroup => {
    expect(meshGroup.children.length).toBe(3);
  });
});

test('Check translation of group', () => {
  const x = 10;
  const y = 5;
  const z = -5;
  const scene = new Scene();
  const object1Aux = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(),
    scene,
  );
  const object2Aux = new Sphere(
    { radius },
    [],
    ObjectsCommon.createViewOptions(),
    scene,
  );
  const object3Aux = new Cylinder(
    { r0, r1, height },
    [],
    ObjectsCommon.createViewOptions(),
    scene,
  );

  scene.addNewObjectFromJSON(object1Aux.toJSON());
  const object1 = (scene as any).BitbloqScene[0];
  scene.addNewObjectFromJSON(object2Aux.toJSON());
  const object2 = (scene as any).BitbloqScene[1];
  scene.addNewObjectFromJSON(object3Aux.toJSON());
  const object3 = (scene as any).BitbloqScene[2];

  const group = new ObjectsGroups([object1, object2, object3], scene);
  group.setOperations([{ type: 'translation', x, y, z, relative: false }]);

  return group.getMeshAsync().then(meshGroup => {
    meshGroup.children.forEach(mesh => {
      expect(mesh.position).toEqual({ x, y, z });
    });
  });
});

test('Check rotation of group', () => {
  const angle = Math.PI / 3;
  const scene = new Scene();
  const object1Aux = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(),
    scene,
  );
  const object2Aux = new Sphere(
    { radius },
    [],
    ObjectsCommon.createViewOptions(),
    scene,
  );
  const object3Aux = new Cylinder(
    { r0, r1, height },
    [],
    ObjectsCommon.createViewOptions(),
    scene,
  );

  scene.addNewObjectFromJSON(object1Aux.toJSON());
  const object1 = (scene as any).BitbloqScene[0];
  scene.addNewObjectFromJSON(object2Aux.toJSON());
  const object2 = (scene as any).BitbloqScene[1];
  scene.addNewObjectFromJSON(object3Aux.toJSON());
  const object3 = (scene as any).BitbloqScene[2];

  const group = new ObjectsGroups([object1, object2, object3], scene);

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
  const scene = new Scene();
  const object1Aux = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(),
    scene,
  );
  const object2Aux = new Sphere(
    { radius },
    [],
    ObjectsCommon.createViewOptions(),
    scene,
  );
  const object3Aux = new Cylinder(
    { r0, r1, height },
    [],
    ObjectsCommon.createViewOptions(),
    scene,
  );

  scene.addNewObjectFromJSON(object1Aux.toJSON());
  const object1 = (scene as any).BitbloqScene[0];
  scene.addNewObjectFromJSON(object2Aux.toJSON());
  const object2 = (scene as any).BitbloqScene[1];
  scene.addNewObjectFromJSON(object3Aux.toJSON());
  const object3 = (scene as any).BitbloqScene[2];

  const group = new ObjectsGroups([object1, object2, object3], scene);

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

  const scene = new Scene();
  const object1Aux = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(),
    scene,
  );
  const object2Aux = new Sphere(
    { radius },
    [],
    ObjectsCommon.createViewOptions(),
    scene,
  );
  const object3Aux = new Cylinder(
    { r0, r1, height },
    [],
    ObjectsCommon.createViewOptions(),
    scene,
  );

  scene.addNewObjectFromJSON(object1Aux.toJSON());
  const object1 = (scene as any).BitbloqScene[0];
  scene.addNewObjectFromJSON(object2Aux.toJSON());
  const object2 = (scene as any).BitbloqScene[1];
  scene.addNewObjectFromJSON(object3Aux.toJSON());
  const object3 = (scene as any).BitbloqScene[2];

  const group = new ObjectsGroups([object1, object2, object3], scene);

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
  const scene = new Scene();

  const object1Aux = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(),
    scene,
  );
  const object2Aux = new Sphere(
    { radius },
    [],
    ObjectsCommon.createViewOptions(),
    scene,
  );
  const object3Aux = new Cylinder(
    { r0, r1, height },
    [],
    ObjectsCommon.createViewOptions(),
    scene,
  );

  scene.addNewObjectFromJSON(object1Aux.toJSON());
  const object1 = (scene as any).BitbloqScene[0];
  scene.addNewObjectFromJSON(object2Aux.toJSON());
  const object2 = (scene as any).BitbloqScene[1];
  scene.addNewObjectFromJSON(object3Aux.toJSON());
  const object3 = (scene as any).BitbloqScene[2];

  const group = new ObjectsGroups([object1, object2, object3], scene);

  group.setOperations([
    { type: 'rotation', axis: 'x', angle, relative: false },
    { type: 'translation', x, y, z, relative: true },
  ]);
  const objects: Array<ObjectsCommon> = group.unGroup();
  const object: ObjectsCommon = objects[0];
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

  const scene = new Scene();
  const object1Aux = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(),
    scene,
  );
  object1Aux.setOperations([{ type: 'translation', x, y, z, relative: false }]);
  const object2Aux = new Sphere(
    { radius },
    [],
    ObjectsCommon.createViewOptions(),
    scene,
  );
  const object3Aux = new Cylinder(
    { r0, r1, height },
    [],
    ObjectsCommon.createViewOptions(),
    scene,
  );

  scene.addNewObjectFromJSON(object1Aux.toJSON());
  const object1 = (scene as any).BitbloqScene[0];
  scene.addNewObjectFromJSON(object2Aux.toJSON());
  const object2 = (scene as any).BitbloqScene[1];
  scene.addNewObjectFromJSON(object3Aux.toJSON());
  const object3 = (scene as any).BitbloqScene[2];

  const group = new ObjectsGroups([object1, object2, object3], scene);

  group.setOperations([{ type: 'translation', x, y, z, relative: false }]);
  const objects: Array<ObjectsCommon> = group.unGroup();
  const object: ObjectsCommon = objects[0];
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
  const scene = new Scene();
  const object1Aux = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(),
    scene,
  );
  object1Aux.setOperations([{ type: 'translation', x, y, z, relative: false }]);
  const object2Aux = new Sphere(
    { radius },
    [],
    ObjectsCommon.createViewOptions(),
    scene,
  );
  const object3Aux = new Cylinder(
    { r0, r1, height },
    [],
    ObjectsCommon.createViewOptions(),
    scene,
  );

  scene.addNewObjectFromJSON(object1Aux.toJSON());
  const object1 = (scene as any).BitbloqScene[0];
  scene.addNewObjectFromJSON(object2Aux.toJSON());
  const object2 = (scene as any).BitbloqScene[1];
  scene.addNewObjectFromJSON(object3Aux.toJSON());
  const object3 = (scene as any).BitbloqScene[2];

  const group = new ObjectsGroups([object1, object2, object3], scene);

  group.setOperations([{ type: 'translation', x, y, z, relative: false }]);
  const objects: Array<ObjectsCommon> = group.unGroup();
  const object: ObjectsCommon = objects[1];
  return object.getMeshAsync().then(mesh => {
    expect(mesh.position.x).toBe(x);
    expect(mesh.position.y).toBe(y);
    expect(mesh.position.z).toBe(z);
  });
});
