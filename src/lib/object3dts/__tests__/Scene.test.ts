import Cube, { ICubeJSON } from '../Cube';
import * as THREE from 'three';
import ObjectsCommon, { ITranslateOperation, IRotateOperation, IScaleOperation } from '../ObjectsCommon';
import Scene from '../Scene';
import Sphere from '../Sphere';
import ObjectFactory from '../ObjectFactory';
const width = 10;
const height = 20;
const depth = 30;
const radius = 4;


test('Test Scene.addObject()', () =>{
  const scene = new Scene();
  const object1 = new Cube({width, height, depth});
  const object2 = new Sphere({radius});
  scene.addObject(object1.toJSON());
  scene.addObject(object2.toJSON());
  return scene.getSceneAsync().then( scene => {
    expect(scene.children.length).toEqual(2);
    expect((scene.children[0] as THREE.Mesh).geometry).toBeInstanceOf(THREE.CubeGeometry);
    expect((scene.children[1] as THREE.Mesh).geometry).toBeInstanceOf(THREE.SphereGeometry);
  });
});

test('Test Scene.toJSON()', () =>{
  const scene = new Scene();
  const object1 = new Cube({width, height, depth});
  const object2 = new Sphere({radius});
  scene.addObject(object1.toJSON());
  scene.addObject(object2.toJSON());
  const json:string = scene.toJSON();
  const objsJSON: Array<string> = JSON.parse(json);
  const objs = objsJSON.map(jsonElement => ObjectFactory.newFromJSON(jsonElement));
  expect(objs.length).toEqual(2);
  expect((objs[0] as any).parameters.width).toBe(width);
  expect((objs[0] as any).parameters.height).toBe(height);
  expect((objs[0] as any).parameters.depth).toBe(depth);
  expect((objs[1] as any).parameters.radius).toBe(radius);
});

test('Test Scene.removeObject()', () =>{
  const scene = new Scene();
  const object1 = new Cube({width, height, depth});
  const object2 = new Sphere({radius});
  const object3 = new Sphere({radius});
  scene.addObject(object1.toJSON());
  scene.addObject(object2.toJSON());
  scene.addObject(object3.toJSON());
  const json:string = scene.toJSON();
  const objsJSON: Array<string> = JSON.parse(json);
  const objs = objsJSON.map(jsonElement => ObjectFactory.newFromJSON(jsonElement));
  expect(objs.length).toEqual(3);
  scene.removeObject(objsJSON[1]); //remove object2
  return scene.getSceneAsync().then( scene => {
    expect(scene.children.length).toEqual(2);
    expect((scene.children[0] as THREE.Mesh).geometry).toBeInstanceOf(THREE.CubeGeometry);
    expect((scene.children[1] as THREE.Mesh).geometry).toBeInstanceOf(THREE.SphereGeometry);
  });
});