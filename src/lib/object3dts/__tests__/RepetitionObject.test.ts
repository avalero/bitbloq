import ObjectsGroups from '../ObjectsGroup';

import Cube, { ICubeJSON } from '../Cube';
import Object3D from '../Object3D';
import RepetitionObject, { IRepetitionObjectJSON } from '../RepetitionObject';
import ObjectsGroup from '../ObjectsGroup';
import ObjectsCommon from '../ObjectsCommon';
import Scene from '../Scene';

const width = 7;
const height = 5;
const depth = 10;

test('Check addition of objects to Group', () => {
  const object1: Cube = new Cube({ width, height, depth });
  const repetion: RepetitionObject = new RepetitionObject(
    { type: 'cartesian', x: 10, y: 0, z: 0, num: 10 },
    object1,
  );

  return repetion.getMeshAsync().then(meshGroup => {
    expect(meshGroup.children.length).toEqual(10);
  });
});

test('Check position of objects to Group', () => {
  const object1: Cube = new Cube({ width, height, depth });
  const repetion: RepetitionObject = new RepetitionObject(
    { type: 'cartesian', x: 10, y: 20, z: 30, num: 3 },
    object1,
  );

  return repetion.getMeshAsync().then(meshGroup => {
    const position0 = meshGroup.children[0].position;
    const position2 = meshGroup.children[2].position;
    expect(position0).toEqual({ x: 0, y: 0, z: 0 });
    expect(position2).toEqual({ x: 20, y: 40, z: 60 });
  });
});

test('Test getGroup', () => {
  const object1: Cube = new Cube({ width, height, depth });
  const repetion: RepetitionObject = new RepetitionObject(
    { type: 'cartesian', x: 10, y: 20, z: 30, num: 3 },
    object1,
  );
  const group: ObjectsGroup = repetion.getGroup();
  const objects: Array<ObjectsCommon> = group.unGroup();
  expect(objects.length).toBe(3);
  return objects[0].getMeshAsync().then(mesh => {
    expect(mesh.position).toEqual({ x: 0, y: 0, z: 0 });
  });
});

test('Test getGroup', () => {
  const object1: Cube = new Cube({ width, height, depth });
  const repetion: RepetitionObject = new RepetitionObject(
    { type: 'cartesian', x: 10, y: 20, z: 30, num: 3 },
    object1,
  );
  const group: ObjectsGroup = repetion.getGroup();
  const objects: Array<ObjectsCommon> = group.unGroup();
  expect(objects.length).toBe(3);
  return objects[2].getMeshAsync().then(mesh => {
    expect(mesh.position).toEqual({ x: 20, y: 40, z: 60 });
  });
});

test('Test newFromJSON', () => {
  const object1: Cube = new Cube({ width, height, depth });

  const scene: Scene = new Scene();
  scene.addExistingObject(object1);

  const jsonObj: IRepetitionObjectJSON = {
    type: RepetitionObject.typeName,
    id: '',
    parameters: { type: 'cartesian', x: 10, y: 20, z: 30, num: 3 },
    object: object1.toJSON(),
    group: [],
    viewOptions: ObjectsCommon.createViewOptions(),
    operations: [],
  };

  const repetion: RepetitionObject = RepetitionObject.newFromJSON(
    jsonObj,
    scene,
  );

  const group: ObjectsGroup = repetion.getGroup();
  const objects: Array<ObjectsCommon> = group.unGroup();
  expect(objects.length).toBe(3);
  return repetion.getMeshAsync().then(meshGroup => {
    expect(meshGroup.children.length).toEqual(3);
  });
});

test('Test newFromJSON - id does not match', () => {
  const object1: Cube = new Cube({ width, height, depth });

  const scene: Scene = new Scene();
  scene.addExistingObject(object1);

  const object2 = object1.clone();

  const jsonObj: IRepetitionObjectJSON = {
    type: RepetitionObject.typeName,
    id: '',
    parameters: { type: 'cartesian', x: 10, y: 20, z: 30, num: 3 },
    object: object2.toJSON(),
    group: [],
    viewOptions: ObjectsCommon.createViewOptions(),
    operations: [],
  };
  const e = () => RepetitionObject.newFromJSON(jsonObj, scene);
  expect(e).toThrowError();
});

test('Test updateFromJSON - Update Parameters', () => {
  const object1: Cube = new Cube({ width, height, depth });

  const scene: Scene = new Scene();
  scene.addExistingObject(object1);

  const jsonObj: IRepetitionObjectJSON = {
    type: RepetitionObject.typeName,
    id: '',
    parameters: { type: 'cartesian', x: 10, y: 20, z: 30, num: 3 },
    object: object1.toJSON(),
    group: [],
    viewOptions: ObjectsCommon.createViewOptions(),
    operations: [],
  };

  const repetition: RepetitionObject = RepetitionObject.newFromJSON(
    jsonObj,
    scene,
  );

  const jsonObjUpdate: IRepetitionObjectJSON = {
    type: RepetitionObject.typeName,
    id: repetition.getID(),
    parameters: { type: 'cartesian', x: 10, y: 20, z: 30, num: 10 },
    object: object1.toJSON(),
    group: [],
    viewOptions: ObjectsCommon.createViewOptions(),
    operations: [],
  };

  repetition.updateFromJSON(jsonObjUpdate);

  const group: ObjectsGroup = repetition.getGroup();
  const objects: Array<ObjectsCommon> = group.unGroup();
  expect(objects.length).toBe(10);
  return repetition.getMeshAsync().then(meshGroup => {
    expect(meshGroup.children.length).toEqual(10);
  });
});

test('Test updateFromJSON - Update Object', () => {
  const object1: Cube = new Cube({ width, height, depth });

  const scene: Scene = new Scene();
  scene.addExistingObject(object1);

  const jsonObj: IRepetitionObjectJSON = {
    type: RepetitionObject.typeName,
    id: '',
    parameters: { type: 'cartesian', x: 10, y: 20, z: 30, num: 3 },
    object: object1.toJSON(),
    group: [],
    viewOptions: ObjectsCommon.createViewOptions(),
    operations: [],
  };

  const repetition: RepetitionObject = RepetitionObject.newFromJSON(
    jsonObj,
    scene,
  );

  const objJJJ = object1.toJSON();
  (objJJJ as ICubeJSON).parameters.width = 2 * width;
  const jsonObjUpdate: IRepetitionObjectJSON = {
    type: RepetitionObject.typeName,
    id: repetition.getID(),
    parameters: { type: 'cartesian', x: 10, y: 20, z: 30, num: 10 },
    object: objJJJ,
    group: [],
    viewOptions: ObjectsCommon.createViewOptions(),
    operations: [],
  };

  repetition.updateFromJSON(jsonObjUpdate);

  const group: ObjectsGroup = repetition.getGroup();
  const objects: Array<ObjectsCommon> = group.unGroup();
  expect(objects.length).toBe(10);
  expect((objects[0] as any).parameters.width).toEqual(2 * width);
  return repetition.getMeshAsync().then(meshGroup => {
    expect(meshGroup.children.length).toEqual(10);
  });
});
