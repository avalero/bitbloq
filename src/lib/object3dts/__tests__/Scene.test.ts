import Cube, { ICubeJSON } from '../Cube';
import * as THREE from 'three';
import ObjectsCommon, {
  ITranslateOperation,
  IRotateOperation,
  IScaleOperation,
  IObjectsCommonJSON,
} from '../ObjectsCommon';
import Scene from '../Scene';
import Sphere from '../Sphere';
import ObjectFactory from '../ObjectFactory';
import Cylinder from '../Cylinder';
import ObjectsGroup from '../ObjectsGroup';
import RepetitionObject, {
  ICartesianRepetitionParams,
} from '../RepetitionObject';
const width = 10;
const height = 20;
const depth = 30;
const radius = 4;
const r0 = 12;
const r1 = 10;

test('Test Scene.addObjectFromJSON()', () => {
  const scene = new Scene();
  const object1 = new Cube({ width, height, depth });
  const object2 = new Sphere({ radius });
  scene.addNewObjectFromJSON(object1.toJSON());
  scene.addNewObjectFromJSON(object2.toJSON());

  return scene.getObjectsAsync().then(scene => {
    expect(scene.children.length).toEqual(2);
    expect((scene.children[0] as THREE.Mesh).geometry).toBeInstanceOf(
      THREE.CubeGeometry,
    );
    expect((scene.children[1] as THREE.Mesh).geometry).toBeInstanceOf(
      THREE.SphereGeometry,
    );
  });
});

test('Test Scene.toJSON()', () => {
  const scene = new Scene();
  const object1 = new Cube({ width, height, depth });
  const object2 = new Sphere({ radius });
  scene.addNewObjectFromJSON(object1.toJSON());
  scene.addNewObjectFromJSON(object2.toJSON());

  const objsJSON: Array<IObjectsCommonJSON> = scene.toJSON();
  const objs = objsJSON.map(jsonElement =>
    ObjectFactory.newFromJSON(jsonElement, scene),
  );
  expect(objs.length).toEqual(2);
  expect((objs[0] as any).parameters.width).toBe(width);
  expect((objs[0] as any).parameters.height).toBe(height);
  expect((objs[0] as any).parameters.depth).toBe(depth);
  expect((objs[1] as any).parameters.radius).toBe(radius);
});

test('Test Scene.removeObject()', () => {
  const scene = new Scene();
  const object1 = new Cube({ width, height, depth });
  const object2 = new Sphere({ radius });
  const object3 = new Sphere({ radius });
  scene.addNewObjectFromJSON(object1.toJSON());
  scene.addNewObjectFromJSON(object2.toJSON());
  scene.addNewObjectFromJSON(object3.toJSON());

  const objsJSON: Array<IObjectsCommonJSON> = scene.toJSON();
  const objs = objsJSON.map(jsonElement =>
    ObjectFactory.newFromJSON(jsonElement, scene),
  );
  expect(objs.length).toEqual(3);
  scene.removeObject(objsJSON[1]); //remove object2
  return scene.getObjectsAsync().then(scene => {
    expect(scene.children.length).toEqual(2);
    expect((scene.children[0] as THREE.Mesh).geometry).toBeInstanceOf(
      THREE.CubeGeometry,
    );
    expect((scene.children[1] as THREE.Mesh).geometry).toBeInstanceOf(
      THREE.SphereGeometry,
    );
  });
});

test('Scene.updateFromJSON() - ', () => {
  const color = '#abcdef';
  const visible = true;
  const name = 'Object123';
  const highlighted = false;
  const x = 5;
  const y = 10;
  const z = 20;
  const axis = 'z';
  const angle = 30;

  const object1 = new Cube(
    { width: 3 * width, height: 2 * height, depth: 5 * depth },
    [
      ObjectsCommon.createTranslateOperation(2 * x, 3 * y, 5 * z),
      ObjectsCommon.createRotateOperation('y', 2 * angle),
    ],
    ObjectsCommon.createViewOptions(color, visible, highlighted, name),
  );

  const object2 = new Cube(
    { width, height, depth },
    [
      ObjectsCommon.createTranslateOperation(x, y, z),
      ObjectsCommon.createRotateOperation(axis, angle),
    ],
    ObjectsCommon.createViewOptions(color, visible, highlighted, name),
  );

  const object3 = new Cube(
    { width: 5 * width, height: 5 * height, depth: 5 * depth },
    [
      ObjectsCommon.createTranslateOperation(5 * x, 5 * y, 5 * z),
      ObjectsCommon.createRotateOperation('y', 5 * angle),
    ],
    ObjectsCommon.createViewOptions(color, visible, highlighted, name),
  );

  const json1 = object1.toJSON();
  const json2 = object2.toJSON();
  const json3 = object3.toJSON();

  const scene = new Scene();
  scene.addNewObjectFromJSON(json1);
  scene.addNewObjectFromJSON(json2);
  scene.addNewObjectFromJSON(json3);

  const objectsInScene: Array<ObjectsCommon> = (scene as any).objectsInScene;
  const objectsCollector: Array<ObjectsCommon> = (scene as any).objectCollector;
  expect(objectsInScene.length).toEqual(3);
  expect(objectsCollector.length).toEqual(3);

  const obj = objectsCollector[1];
  const obj_a = objectsCollector[0];
  const obj_b = objectsCollector[2];
  expect((obj as any).parameters.width).toEqual(width);
  const aux_obj: ICubeJSON = obj.toJSON() as ICubeJSON;
  aux_obj.parameters.width = 100;

  scene.updateObject(aux_obj);
  expect((obj as any).parameters.width).toEqual(100);
  expect((obj_a as any).parameters.width).toEqual(3 * width);
  expect((obj_b as any).parameters.width).toEqual(5 * width);
});

test('Add group to Scene. Check if group objects are removed', () => {
  const scene = new Scene();

  const cube = new Cube({ width, height, depth });
  scene.addExistingObject(cube);

  const cylinder = new Cylinder({ r0, r1, height });
  scene.addExistingObject(cylinder);

  const sphere = new Sphere({ radius });
  scene.addExistingObject(sphere);

  expect((scene as any).objectsInScene.length).toEqual(3);
  expect((scene as any).objectCollector.length).toEqual(3);

  const group = new ObjectsGroup([cube, cylinder]);

  scene.addExistingObject(group);

  expect((scene as any).objectsInScene.length).toEqual(2);
  expect((scene as any).objectCollector.length).toEqual(4);
  expect(scene.objectInObjectCollector(cube.toJSON())).toBe(true);
  expect(scene.objectInScene(cube.toJSON())).toBe(false);
  expect(scene.objectInObjectCollector(cylinder.toJSON())).toBe(true);
  expect(scene.objectInScene(cylinder.toJSON())).toBe(false);
  expect(scene.objectInObjectCollector(sphere.toJSON())).toBe(true);
  expect(scene.objectInScene(sphere.toJSON())).toBe(true);
  expect(scene.objectInObjectCollector(group.toJSON())).toBe(true);
  expect(scene.objectInScene(group.toJSON())).toBe(true);
});

test('Add repetition to Scene. Check if main object is removed', () => {
  const scene = new Scene();

  const cube = new Cube({ width, height, depth });
  scene.addExistingObject(cube);

  const cylinder = new Cylinder({ r0, r1, height });
  scene.addExistingObject(cylinder);

  const sphere = new Sphere({ radius });
  scene.addExistingObject(sphere);

  expect((scene as any).objectsInScene.length).toEqual(3);
  expect((scene as any).objectCollector.length).toEqual(3);

  const rep = new RepetitionObject(
    { type: 'cartesian', x: 10, y: 20, z: 30, num: 10 },
    cube,
  );

  scene.addExistingObject(rep);

  expect((scene as any).objectsInScene.length).toEqual(3);
  expect((scene as any).objectCollector.length).toEqual(4);
  expect(scene.objectInObjectCollector(cube.toJSON())).toBe(true);
  expect(scene.objectInScene(cube.toJSON())).toBe(false);
  expect(scene.objectInObjectCollector(cylinder.toJSON())).toBe(true);
  expect(scene.objectInScene(cylinder.toJSON())).toBe(true);
  expect(scene.objectInObjectCollector(sphere.toJSON())).toBe(true);
  expect(scene.objectInScene(sphere.toJSON())).toBe(true);
  expect(scene.objectInObjectCollector(rep.toJSON())).toBe(true);
  expect(scene.objectInScene(rep.toJSON())).toBe(true);
});

test('Add repetition and group to Scene. Check repetition of non-present object cannot be created', () => {
  const scene = new Scene();

  const cube = new Cube({ width, height, depth });
  scene.addExistingObject(cube);

  const cylinder = new Cylinder({ r0, r1, height });
  scene.addExistingObject(cylinder);

  const sphere = new Sphere({ radius });
  scene.addExistingObject(sphere);

  expect((scene as any).objectsInScene.length).toEqual(3);
  expect((scene as any).objectCollector.length).toEqual(3);

  const rep = new RepetitionObject(
    { type: 'cartesian', x: 10, y: 20, z: 30, num: 10 },
    cube,
  );

  scene.addExistingObject(rep);

  expect((scene as any).objectsInScene.length).toEqual(3);
  expect((scene as any).objectCollector.length).toEqual(4);
  expect(scene.objectInObjectCollector(cube.toJSON())).toBe(true);
  expect(scene.objectInScene(cube.toJSON())).toBe(false);
  expect(scene.objectInObjectCollector(cylinder.toJSON())).toBe(true);
  expect(scene.objectInScene(cylinder.toJSON())).toBe(true);
  expect(scene.objectInObjectCollector(sphere.toJSON())).toBe(true);
  expect(scene.objectInScene(sphere.toJSON())).toBe(true);
  expect(scene.objectInObjectCollector(rep.toJSON())).toBe(true);
  expect(scene.objectInScene(rep.toJSON())).toBe(true);

  const group = new ObjectsGroup([cylinder, sphere]);
  scene.addExistingObject(group);

  expect((scene as any).objectsInScene.length).toEqual(2);
  expect((scene as any).objectCollector.length).toEqual(5);
  expect(scene.objectInObjectCollector(cube.toJSON())).toBe(true);
  expect(scene.objectInScene(cube.toJSON())).toBe(false);
  expect(scene.objectInObjectCollector(cylinder.toJSON())).toBe(true);
  expect(scene.objectInScene(cylinder.toJSON())).toBe(false);
  expect(scene.objectInObjectCollector(sphere.toJSON())).toBe(true);
  expect(scene.objectInScene(sphere.toJSON())).toBe(false);
  expect(scene.objectInObjectCollector(rep.toJSON())).toBe(true);
  expect(scene.objectInScene(rep.toJSON())).toBe(true);
  expect(scene.objectInObjectCollector(group.toJSON())).toBe(true);
  expect(scene.objectInScene(group.toJSON())).toBe(true);

  const group2 = new ObjectsGroup([cylinder, sphere]);
  const e = () => scene.addExistingObject(group2);

  expect(e).toThrowError();

  const rep2 = new RepetitionObject(
    { type: 'cartesian', x: 10, y: 20, z: 30, num: 10 },
    cube,
  );
  const e2 = () => scene.addExistingObject(rep2);

  expect(e2).toThrowError();
});

// test('Create scene from JSON', () => {
//   const sceneaux = new Scene();

//   const cube = new Cube({ width, height, depth });
//   sceneaux.addExistingObject(cube);

//   const cylinder = new Cylinder({ r0, r1, height });
//   sceneaux.addExistingObject(cylinder);

//   const sphere = new Sphere({ radius });
//   sceneaux.addExistingObject(sphere);

//   const rep = new RepetitionObject(
//     { type: 'cartesian', x: 10, y: 20, z: 30, num: 10 },
//     cube,
//   );

//   sceneaux.addExistingObject(rep);
//   const group = new ObjectsGroup([cylinder, sphere]);
//   sceneaux.addExistingObject(group);

//   const scene = Scene(sceneaux.toJSON());

//   expect((scene as any).objectsInScene.length).toEqual(2);
//   expect((scene as any).objectCollector.length).toEqual(5);
//   expect(scene.objectsCollector(cube.toJSON())).toBe(true);
//   expect(scene.objectsInScene(cube.toJSON())).toBe(false);
//   expect(scene.objectsCollector(cylinder.toJSON())).toBe(true);
//   expect(scene.objectsInScene(cylinder.toJSON())).toBe(false);
//   expect(scene.objectsCollector(sphere.toJSON())).toBe(true);
//   expect(scene.objectsInScene(sphere.toJSON())).toBe(false);
//   expect(scene.objectsCollector(rep.toJSON())).toBe(true);
//   expect(scene.objectsInScene(rep.toJSON())).toBe(true);
//   expect(scene.objectsCollector(group.toJSON())).toBe(true);
//   expect(scene.objectsInScene(group.toJSON())).toBe(true);

//   const group2 = new ObjectsGroup([cylinder, sphere]);
//   const e = () => scene.addExistingObject(group2);

//   expect(e).toThrowError();

//   const rep2 = new RepetitionObject(
//     { type: 'cartesian', x: 10, y: 20, z: 30, num: 10 },
//     cube,
//   );
//   const e2 = () => scene.addExistingObject(rep2);

//   expect(e2).toThrowError();

// });
