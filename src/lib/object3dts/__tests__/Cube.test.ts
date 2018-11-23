/**
 * Copyright (c) 2018 Bitbloq (BQ)
 *
 * License: MIT
 *
 * long description for the file
 *
 * @summary short description for the file
 * @author David García <https://github.com/empoalp>, Alberto Valero <https://github.com/avalero>
 *
 * Created at     : 2018-11-15 16:42:13
 * Last modified  : 2018-11-15 19:02:55
 */

import Cube, { ICubeJSON } from '../Cube';
import * as THREE from 'three';
import ObjectsCommon, {
  ITranslateOperation,
  IRotateOperation,
  IScaleOperation,
} from '../ObjectsCommon';

const width = 10;
const height = 20;
const depth = 30;

test('Check params are well passed', () => {
  const object = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(),
  );
  expect((object as any).parameters.width).toBe(width);
  expect((object as any).parameters.height).toBe(height);
  expect((object as any).parameters.depth).toBe(depth);
});

test('Check there are no initial operations', () => {
  const object = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(),
  );
  expect((object as any).operations).toEqual([]);
});

test('Check mesh needs to be computed', () => {
  const object = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(),
  );
  expect(object.meshUpdateRequired).toBe(true);
});

test('Check params are well passed and mesh needs to be recomputed', () => {
  // Update parameters to same value to check if updateRequired switches to true
  const object = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(),
  );
  object.setParameters({ width: 5, height: 5, depth: 5 });
  expect((object as any).parameters).toEqual({ width: 5, height: 5, depth: 5 });
  expect(object.meshUpdateRequired).toBe(true);
  object.getPrimitiveMeshAsync().then(mesh1 => {
    expect(object.meshUpdateRequired).toBe(false);
    object.getPrimitiveMeshAsync().then(mesh2 => {
      expect(mesh1).toBe(mesh2);
    });
  });
});

test('Check mesh needs to be computed only once', () => {
  const object = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(),
  );
  expect(object.meshUpdateRequired).toBe(true);
  object.setParameters({ width, height, depth });
  expect((object as any).parameters).toEqual({ width, height, depth });
  expect(object.meshUpdateRequired).toBe(true);
});

test('Check Object Dimensions are well Constructed', () => {
  const object = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(),
  );
  return object.getPrimitiveMeshAsync().then(mesh => {
    const boundingBoxDims: THREE.Vector3 = new THREE.Vector3();
    new THREE.Box3().setFromObject(mesh).getSize(boundingBoxDims);
    expect(boundingBoxDims).toEqual({ x: width, y: depth, z: height });
  });
});

test('Check initial position and rotation', () => {
  const object = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(),
  );
  return object.getPrimitiveMeshAsync().then(mesh => {
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
  const object = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(),
  );
  object.setParameters({ width: 5, height: 5, depth: 5 });
  expect((object as any).parameters).toEqual({ width: 5, height: 5, depth: 5 });
  expect(object.meshUpdateRequired).toBe(true);

  return object.getMeshAsync().then(mesh1 => {
    expect(object.meshUpdateRequired).toBe(false);
    return object.getMeshAsync().then(mesh2 => {
      expect(mesh1).toBe(mesh2);
    });
  });
});

test('Async Check Object Dimensions are well Constructed', () => {
  const object = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(),
  );
  return object.getMeshAsync().then(mesh => {
    const boundingBoxDims: THREE.Vector3 = new THREE.Vector3();
    new THREE.Box3().setFromObject(mesh).getSize(boundingBoxDims);
    expect(boundingBoxDims).toEqual({ x: width, y: depth, z: height });
  });
});

test('Async Check initial position and rotation', () => {
  const object = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(),
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

test('Cube - toJSON - Parameteres', () => {
  const object = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(),
  );
  const obj: ICubeJSON = object.toJSON() as ICubeJSON;
  expect(obj.parameters.width).toEqual(width);
  expect(obj.parameters.height).toEqual(height);
  expect(obj.parameters.depth).toEqual(depth);
});

test('Cube - toJSON - Operations', () => {
  const x = 5;
  const y = 10;
  const z = 20;
  const axis = 'z';
  const angle = 30;

  const object = new Cube(
    { width, height, depth },
    [
      ObjectsCommon.createTranslateOperation(x, y, z),
      ObjectsCommon.createRotateOperation(axis, angle),
    ],
    ObjectsCommon.createViewOptions(),
  );
  const obj: ICubeJSON = object.toJSON() as ICubeJSON;
  expect(obj.operations.length).toEqual(2);
  expect(obj.operations[0].type).toEqual('translation');
  expect(obj.operations[1].type).toEqual('rotation');
  expect((obj.operations[0] as ITranslateOperation).x).toEqual(x);
  expect((obj.operations[0] as ITranslateOperation).y).toEqual(y);
  expect((obj.operations[0] as ITranslateOperation).z).toEqual(z);
  expect((obj.operations[1] as IRotateOperation).axis).toEqual(axis);
  expect((obj.operations[1] as IRotateOperation).angle).toEqual(angle);
  object.addOperations([ObjectsCommon.createScaleOperation(x, y, z)]);
  const obj2: ICubeJSON = object.toJSON() as ICubeJSON;
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

test('Cube - toJSON - ViewOptions', () => {
  const color = '#abcdef';
  const visible = true;
  const name = 'Object123';
  const highlighted = false;

  const object = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(color, visible, highlighted, name),
  );
  const obj: ICubeJSON = object.toJSON() as ICubeJSON;
  expect(obj.viewOptions.color).toEqual(color);
  expect(obj.viewOptions.name).toEqual(name);
  expect(obj.viewOptions.visible).toEqual(visible);
  expect(obj.viewOptions.highlighted).toEqual(highlighted);
});

test('Cube - fromJSON - Parameteres', () => {
  const object1 = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(),
  );
  const json1: ICubeJSON = object1.toJSON() as ICubeJSON;
  const object = Cube.newFromJSON(json1);
  const obj: ICubeJSON = object.toJSON() as ICubeJSON;
  expect(obj.parameters.width).toEqual(width);
  expect(obj.parameters.height).toEqual(height);
  expect(obj.parameters.depth).toEqual(depth);
});

test('Cube - fromJSON - Operations', () => {
  const x = 5;
  const y = 10;
  const z = 20;
  const axis = 'z';
  const angle = 30;

  const object1 = new Cube(
    { width, height, depth },
    [
      ObjectsCommon.createTranslateOperation(x, y, z),
      ObjectsCommon.createRotateOperation(axis, angle),
    ],
    ObjectsCommon.createViewOptions(),
  );
  const json1: ICubeJSON = object1.toJSON() as ICubeJSON;
  const object = Cube.newFromJSON(json1);
  const obj: ICubeJSON = object.toJSON() as ICubeJSON;
  expect(obj.operations.length).toEqual(2);
  expect(obj.operations[0].type).toEqual('translation');
  expect(obj.operations[1].type).toEqual('rotation');
  expect((obj.operations[0] as ITranslateOperation).x).toEqual(x);
  expect((obj.operations[0] as ITranslateOperation).y).toEqual(y);
  expect((obj.operations[0] as ITranslateOperation).z).toEqual(z);
  expect((obj.operations[1] as IRotateOperation).axis).toEqual(axis);
  expect((obj.operations[1] as IRotateOperation).angle).toEqual(angle);
});

test('Cube - fromJSON - ViewOptions', () => {
  const color = '#abcdef';
  const visible = true;
  const name = 'Object123';
  const highlighted = false;

  const object1 = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(color, visible, highlighted, name),
  );
  const json1: ICubeJSON = object1.toJSON() as ICubeJSON;
  const object = Cube.newFromJSON(json1);
  const obj: ICubeJSON = object.toJSON() as ICubeJSON;
  expect(obj.viewOptions.color).toEqual(color);
  expect(obj.viewOptions.name).toEqual(name);
  expect(obj.viewOptions.visible).toEqual(visible);
  expect(obj.viewOptions.highlighted).toEqual(highlighted);
});

test('Cube - UpdateFromJSON - ', () => {
  const color = '#abcdef';
  const visible = true;
  const name = 'Object123';
  const highlighted = false;
  const x = 5;
  const y = 10;
  const z = 20;
  const axis = 'z';
  const angle = 30;

  const object = new Cube(
    { width: 3 * width, height: 2 * height, depth: 5 * depth },
    [
      ObjectsCommon.createTranslateOperation(2 * x, 3 * y, 5 * z),
      ObjectsCommon.createRotateOperation('y', 2 * angle),
    ],
    ObjectsCommon.createViewOptions(color, visible, highlighted, name),
  );

  const object1 = new Cube(
    { width, height, depth },
    [
      ObjectsCommon.createTranslateOperation(x, y, z),
      ObjectsCommon.createRotateOperation(axis, angle),
    ],
    ObjectsCommon.createViewOptions(color, visible, highlighted, name),
  );

  const obj1: ICubeJSON = object1.toJSON() as ICubeJSON;

  obj1.id = object.getID();

  object.updateFromJSON(obj1);

  const obj: ICubeJSON = object.toJSON() as ICubeJSON;

  expect(obj.parameters.width).toEqual(width);
  expect(obj.parameters.height).toEqual(height);
  expect(obj.parameters.depth).toEqual(depth);
  expect(obj.type).toEqual('Cube');

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

// CLONE

test('Cube - clone() - Parameteres', () => {
  const aux = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(),
  );
  const object = aux.clone();
  const obj: ICubeJSON = object.toJSON() as ICubeJSON;
  expect(obj.parameters.width).toEqual(width);
  expect(obj.parameters.height).toEqual(height);
  expect(obj.parameters.depth).toEqual(depth);
});

test('Cube - CLONE - Operations', () => {
  const x = 5;
  const y = 10;
  const z = 20;
  const axis = 'z';
  const angle = 30;

  const aux = new Cube(
    { width, height, depth },
    [
      ObjectsCommon.createTranslateOperation(x, y, z),
      ObjectsCommon.createRotateOperation(axis, angle),
    ],
    ObjectsCommon.createViewOptions(),
  );

  const object = aux.clone();
  const obj: ICubeJSON = object.toJSON() as ICubeJSON;
  expect(obj.operations.length).toEqual(2);
  expect(obj.operations[0].type).toEqual('translation');
  expect(obj.operations[1].type).toEqual('rotation');
  expect((obj.operations[0] as ITranslateOperation).x).toEqual(x);
  expect((obj.operations[0] as ITranslateOperation).y).toEqual(y);
  expect((obj.operations[0] as ITranslateOperation).z).toEqual(z);
  expect((obj.operations[1] as IRotateOperation).axis).toEqual(axis);
  expect((obj.operations[1] as IRotateOperation).angle).toEqual(angle);
});

test('Cube - Clone - ViewOptions', () => {
  const color = '#abcdef';
  const visible = true;
  const name = 'Object123';
  const highlighted = false;

  const object1 = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(color, visible, highlighted, name),
  );
  const object = object1.clone();
  const obj: ICubeJSON = object.toJSON() as ICubeJSON;
  expect(obj.viewOptions.color).toEqual(color);
  expect(obj.viewOptions.name).toEqual(name);
  expect(obj.viewOptions.visible).toEqual(visible);
  expect(obj.viewOptions.highlighted).toEqual(highlighted);
});

test('Cube - Clone - no need to update', () => {
  const color = '#abcdef';
  const visible = true;
  const name = 'Object123';
  const highlighted = false;

  const object1 = new Cube(
    { width, height, depth },
    [],
    ObjectsCommon.createViewOptions(color, visible, highlighted, name),
  );
  return object1.getMeshAsync().then(mesh => {
    const object = object1.clone();
    const obj: ICubeJSON = object.toJSON() as ICubeJSON;
    expect(obj.parameters.width).toEqual(width);
    expect(obj.parameters.height).toEqual(height);
    expect(obj.parameters.depth).toEqual(depth);
    expect(obj.viewOptions.color).toEqual(color);
    expect(obj.viewOptions.name).toEqual(name);
    expect(obj.viewOptions.visible).toEqual(visible);
    expect(obj.viewOptions.highlighted).toEqual(highlighted);
  });
});
