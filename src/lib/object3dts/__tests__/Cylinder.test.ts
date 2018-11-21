import Cylinder, { ICylinderJSON } from '../Cylinder';
import ObjectsCommon, {
  ITranslateOperation,
  IRotateOperation,
  IScaleOperation,
  IMirrorOperation,
} from '../ObjectsCommon';
import * as THREE from 'three';
import Scene from '../Scene';

const r0 = 10;
const r1 = 5;
const height = 20;

test('Check params are well passed', () => {
  const object = new Cylinder(
    { r0, r1, height },
    [],
    ObjectsCommon.createViewOptions(),
    new Scene(),
  );
  expect((object as any).parameters.r0).toBe(r0);
  expect((object as any).parameters.r1).toBe(r1);
  expect((object as any).parameters.height).toBe(height);
});

test('Check there are no initial operations', () => {
  const object = new Cylinder(
    { r0, r1, height },
    [],
    ObjectsCommon.createViewOptions(),
    new Scene(),
  );
  expect((object as any).operations).toEqual([]);
});

test('Check mesh needs to be computed', () => {
  const object = new Cylinder(
    { r0, r1, height },
    [],
    ObjectsCommon.createViewOptions(),
    new Scene(),
  );
  expect(object.meshUpdateRequired).toBe(true); //does not need to be computed after creation
});

test('Check params are well passed and mesh needs to be recomputed', () => {
  // Update parameters to same value to check if updateRequired switches to true
  const object = new Cylinder(
    { r0, r1, height },
    [],
    ObjectsCommon.createViewOptions(),
    new Scene(),
  );
  object.setParameters({ r0: 5, r1: 5, height: 5 });
  expect((object as any).parameters).toEqual({ r0: 5, r1: 5, height: 5 });
  expect(object.meshUpdateRequired).toBe(true);
  object.getPrimitiveMeshAsync().then(mesh1 => {
    expect(object.meshUpdateRequired).toBe(false);
    object.getPrimitiveMeshAsync().then(mesh2 => {
      expect(mesh1).toBe(mesh2);
    });
  });
});

test('Check mesh needs to be computed only once', () => {
  const object = new Cylinder(
    { r0, r1, height },
    [],
    ObjectsCommon.createViewOptions(),
    new Scene(),
  );
  expect(object.meshUpdateRequired).toBe(true);
  object.setParameters({ r0, r1, height });
  expect((object as any).parameters).toEqual({ r0, r1, height });
  expect(object.meshUpdateRequired).toBe(true);
});

test('Check Object Dimensions are well Constructed', () => {
  const object = new Cylinder(
    { r0, r1, height },
    [],
    ObjectsCommon.createViewOptions(),
    new Scene(),
  );
  const mesh = object.getPrimitiveMeshAsync().then(mesh => {
    const boundingBoxDims: THREE.Vector3 = new THREE.Vector3();
    new THREE.Box3().setFromObject(mesh).getSize(boundingBoxDims);
    expect(boundingBoxDims).toEqual({
      x: 2 * Math.max(r0, r1),
      y: 2 * Math.max(r0, r1),
      z: height,
    });
  });
});

test('Check initial position and rotation', () => {
  const object = new Cylinder(
    { r0, r1, height },
    [],
    ObjectsCommon.createViewOptions(),
    new Scene(),
  );
  object.getPrimitiveMeshAsync().then(mesh => {
    const center = mesh.position;
    const euler = mesh.rotation;
    expect(center).toEqual(new THREE.Vector3(0, 0, 0));
    expect(euler.x).toBeCloseTo(0);
    expect(euler.y).toBeCloseTo(0);
    expect(euler.z).toBeCloseTo(0);
  });
});

// ASYNC TESTS

test('Async Check params are well passed and mesh needs to be recomputed', () => {
  // Update parameters to same value to check if updateRequired switches to true
  const object = new Cylinder(
    { r0, r1, height },
    [],
    ObjectsCommon.createViewOptions(),
    new Scene(),
  );
  object.setParameters({ r0: 5, r1: 5, height: 5 });
  expect((object as any).parameters).toEqual({ r0: 5, r1: 5, height: 5 });
  expect(object.meshUpdateRequired).toBe(true);

  return object.getMeshAsync().then(mesh1 => {
    expect(object.meshUpdateRequired).toBe(false);
    return object.getMeshAsync().then(mesh2 => {
      expect(mesh1).toBe(mesh2);
    });
  });
});

test('Async Check Object Dimensions are well Constructed', () => {
  const object = new Cylinder(
    { r0, r1, height },
    [],
    ObjectsCommon.createViewOptions(),
    new Scene(),
  );
  return object.getMeshAsync().then(mesh => {
    const boundingBoxDims: THREE.Vector3 = new THREE.Vector3();
    new THREE.Box3().setFromObject(mesh).getSize(boundingBoxDims);
    expect(boundingBoxDims).toEqual({
      x: 2 * Math.max(r0, r1),
      y: 2 * Math.max(r0, r1),
      z: height,
    });
  });
});

test('Async Check initial position and rotation', () => {
  const object = new Cylinder(
    { r0, r1, height },
    [],
    ObjectsCommon.createViewOptions(),
    new Scene(),
  );
  return object.getMeshAsync().then(mesh => {
    const center = mesh.position;
    const euler = mesh.rotation;
    expect(center).toEqual(new THREE.Vector3(0, 0, 0));
    expect(euler.x).toBeCloseTo(0);
    expect(euler.y).toBeCloseTo(0);
    expect(euler.z).toBeCloseTo(0);
  });
});

// CHECK FROM JSON - TO JSON - CLONE

test('Cylinder - toJSON - Parameteres', () => {
  const object = new Cylinder(
    { r0, r1, height },
    [],
    ObjectsCommon.createViewOptions(),
    new Scene(),
  );
  const obj: ICylinderJSON = object.toJSON() as ICylinderJSON;
  expect(obj.parameters.r0).toEqual(r0);
  expect(obj.parameters.r1).toEqual(r1);
  expect(obj.parameters.height).toEqual(height);
  expect(obj.type).toEqual('Cylinder');
});

test('Cylinder - toJSON - Operations', () => {
  const x = 5;
  const y = 10;
  const z = 20;
  const axis = 'z';
  const angle = 30;

  const object = new Cylinder(
    { r0, r1, height },
    [
      ObjectsCommon.createTranslateOperation(x, y, z),
      ObjectsCommon.createRotateOperation(axis, angle),
    ],
    ObjectsCommon.createViewOptions(),
    new Scene(),
  );

  const obj: ICylinderJSON = object.toJSON() as ICylinderJSON;
  expect(obj.operations.length).toEqual(2);
  expect(obj.operations[0].type).toEqual('translation');
  expect(obj.operations[1].type).toEqual('rotation');
  expect((obj.operations[0] as ITranslateOperation).x).toEqual(x);
  expect((obj.operations[0] as ITranslateOperation).y).toEqual(y);
  expect((obj.operations[0] as ITranslateOperation).z).toEqual(z);
  expect((obj.operations[1] as IRotateOperation).axis).toEqual(axis);
  expect((obj.operations[1] as IRotateOperation).angle).toEqual(angle);
  object.addOperations([ObjectsCommon.createScaleOperation(x, y, z)]);

  const obj2: ICylinderJSON = object.toJSON() as ICylinderJSON;
  expect(obj2.operations.length).toEqual(3);
  expect(obj2.operations[0].type).toEqual('translation');
  expect(obj2.operations[1].type).toEqual('rotation');
  expect(obj2.operations[2].type).toEqual('scale');
  expect((obj2.operations[0] as ITranslateOperation).x).toEqual(x);
  expect((obj2.operations[0] as ITranslateOperation).y).toEqual(y);
  expect((obj2.operations[0] as ITranslateOperation).z).toEqual(z);
  expect((obj2.operations[1] as IRotateOperation).axis).toEqual(axis);
  expect((obj2.operations[1] as IRotateOperation).angle).toEqual(angle);
  expect((obj2.operations[2] as IScaleOperation).x).toEqual(x);
  expect((obj2.operations[2] as IScaleOperation).y).toEqual(y);
  expect((obj2.operations[2] as IScaleOperation).z).toEqual(z);
});

test('Cylinder - toJSON - ViewOptions', () => {
  const color = '#abcdef';
  const visible = true;
  const name = 'Object123';
  const highlighted = false;

  const object = new Cylinder(
    { r0, r1, height },
    [],
    ObjectsCommon.createViewOptions(color, visible, highlighted, name),
    new Scene(),
  );

  const obj: ICylinderJSON = object.toJSON() as ICylinderJSON;
  expect(obj.viewOptions.color).toEqual(color);
  expect(obj.viewOptions.name).toEqual(name);
  expect(obj.viewOptions.visible).toEqual(visible);
  expect(obj.viewOptions.highlighted).toEqual(highlighted);
});

test('Cylinder - fromJSON - Parameteres', () => {
  const object1 = new Cylinder(
    { r0, r1, height },
    [],
    ObjectsCommon.createViewOptions(),
    new Scene(),
  );
  const json1 = object1.toJSON() as ICylinderJSON;
  const object = Cylinder.newFromJSON(json1, new Scene());

  const obj = object.toJSON() as ICylinderJSON;
  expect(obj.parameters.r0).toEqual(r0);
  expect(obj.parameters.r1).toEqual(r1);
  expect(obj.parameters.height).toEqual(height);
});

test('Cylinder - fromJSON - Operations', () => {
  const x = 5;
  const y = 10;
  const z = 20;
  const axis = 'z';
  const angle = 30;

  const object1 = new Cylinder(
    { r0, r1, height },
    [
      ObjectsCommon.createTranslateOperation(x, y, z),
      ObjectsCommon.createRotateOperation(axis, angle),
    ],
    ObjectsCommon.createViewOptions(),
    new Scene(),
  );
  const json1 = object1.toJSON() as ICylinderJSON;
  const object = Cylinder.newFromJSON(json1, new Scene());

  const obj: ICylinderJSON = object.toJSON() as ICylinderJSON;
  expect(obj.operations.length).toEqual(2);
  expect(obj.operations[0].type).toEqual('translation');
  expect(obj.operations[1].type).toEqual('rotation');
  expect((obj.operations[0] as ITranslateOperation).x).toEqual(x);
  expect((obj.operations[0] as ITranslateOperation).y).toEqual(y);
  expect((obj.operations[0] as ITranslateOperation).z).toEqual(z);
  expect((obj.operations[1] as IRotateOperation).axis).toEqual(axis);
  expect((obj.operations[1] as IRotateOperation).angle).toEqual(angle);
});

test('Cylinder - fromJSON - ViewOptions', () => {
  const color = '#abcdef';
  const visible = true;
  const name = 'Object123';
  const highlighted = false;

  const object1 = new Cylinder(
    { r0, r1, height },
    [],
    ObjectsCommon.createViewOptions(color, visible, highlighted, name),
    new Scene(),
  );
  const json1 = object1.toJSON() as ICylinderJSON;
  const object = Cylinder.newFromJSON(json1, new Scene());

  const obj: ICylinderJSON = object.toJSON() as ICylinderJSON;
  expect(obj.viewOptions.color).toEqual(color);
  expect(obj.viewOptions.name).toEqual(name);
  expect(obj.viewOptions.visible).toEqual(visible);
  expect(obj.viewOptions.highlighted).toEqual(highlighted);
});

// CLONE

test('Cylinder - clone() - Parameteres', () => {
  const aux = new Cylinder(
    { r0, r1, height },
    [],
    ObjectsCommon.createViewOptions(),
    new Scene(),
  );
  const object = aux.clone();

  const obj: ICylinderJSON = object.toJSON() as ICylinderJSON;
  expect(obj.parameters.r0).toEqual(r0);
  expect(obj.parameters.r1).toEqual(r1);
  expect(obj.parameters.height).toEqual(height);
});

test('Cylinder - CLONE - Operations', () => {
  const x = 5;
  const y = 10;
  const z = 20;
  const axis = 'z';
  const angle = 30;

  const aux = new Cylinder(
    { r0, r1, height },
    [
      ObjectsCommon.createTranslateOperation(x, y, z),
      ObjectsCommon.createRotateOperation(axis, angle),
    ],
    ObjectsCommon.createViewOptions(),
    new Scene(),
  );

  const object = aux.clone();
  const obj: ICylinderJSON = object.toJSON() as ICylinderJSON;
  expect(obj.operations.length).toEqual(2);
  expect(obj.operations[0].type).toEqual('translation');
  expect(obj.operations[1].type).toEqual('rotation');
  expect((obj.operations[0] as ITranslateOperation).x).toEqual(x);
  expect((obj.operations[0] as ITranslateOperation).y).toEqual(y);
  expect((obj.operations[0] as ITranslateOperation).z).toEqual(z);
  expect((obj.operations[1] as IRotateOperation).axis).toEqual(axis);
  expect((obj.operations[1] as IRotateOperation).angle).toEqual(angle);
});

test('Cylinder - UpdateFromJSON - ', () => {
  const color = '#abcdef';
  const visible = true;
  const name = 'Object123';
  const highlighted = false;
  const x = 5;
  const y = 10;
  const z = 20;
  const axis = 'z';
  const angle = 30;

  const object = new Cylinder(
    { r0: 3 * r0, height: 2 * height, r1: 5 * r1 },
    [
      ObjectsCommon.createTranslateOperation(2 * x, 3 * y, 5 * z),
      ObjectsCommon.createRotateOperation('y', 2 * angle),
    ],
    ObjectsCommon.createViewOptions(color, visible, highlighted, name),
    new Scene(),
  );

  const object1 = new Cylinder(
    { r0, r1, height },
    [
      ObjectsCommon.createTranslateOperation(x, y, z),
      ObjectsCommon.createRotateOperation(axis, angle),
    ],
    ObjectsCommon.createViewOptions(color, visible, highlighted, name),
    new Scene(),
  );

  const obj1: ICylinderJSON = object1.toJSON() as ICylinderJSON;
  obj1.id = object.getID();
  object.updateFromJSON(obj1);
  const obj: ICylinderJSON = object.toJSON() as ICylinderJSON;

  expect(obj.parameters.r0).toEqual(r0);
  expect(obj.parameters.height).toEqual(height);
  expect(obj.parameters.r1).toEqual(r1);

  expect(obj.viewOptions.color).toEqual(color);
  expect(obj.viewOptions.name).toEqual(name);
  expect(obj.viewOptions.visible).toEqual(visible);
  expect(obj.viewOptions.highlighted).toEqual(highlighted);

  expect(obj.operations.length).toEqual(2);
  expect(obj.operations[0].type).toEqual('translation');
  expect(obj.operations[1].type).toEqual('rotation');
  expect((obj.operations[0] as ITranslateOperation).x).toEqual(x);
  expect((obj.operations[0] as ITranslateOperation).y).toEqual(y);
  expect((obj.operations[0] as ITranslateOperation).z).toEqual(z);
  expect((obj.operations[1] as IRotateOperation).axis).toEqual(axis);
  expect((obj.operations[1] as IRotateOperation).angle).toEqual(angle);
});

test('Cylinder - Clone - ViewOptions', () => {
  const color = '#abcdef';
  const visible = true;
  const name = 'Object123';
  const highlighted = false;

  const object1 = new Cylinder(
    { r0, r1, height },
    [],
    ObjectsCommon.createViewOptions(color, visible, highlighted, name),
    new Scene(),
  );
  const object = object1.clone();
  const obj: ICylinderJSON = object.toJSON() as ICylinderJSON;
  expect(obj.viewOptions.color).toEqual(color);
  expect(obj.viewOptions.name).toEqual(name);
  expect(obj.viewOptions.visible).toEqual(visible);
  expect(obj.viewOptions.highlighted).toEqual(highlighted);
});
