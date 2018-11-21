import Cube, { ICubeJSON } from '../Cube';
import * as THREE from 'three';
import ObjectsCommon, { ITranslateOperation, IRotateOperation, IScaleOperation, IObjectsCommonJSON } from '../ObjectsCommon';
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
  scene.addObjectFromJSON(object1.toJSON());
  scene.addObjectFromJSON(object2.toJSON());
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
  scene.addObjectFromJSON(object1.toJSON());
  scene.addObjectFromJSON(object2.toJSON());
  
  const objsJSON: Array<IObjectsCommonJSON> = scene.toJSON();
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
  scene.addObjectFromJSON(object1.toJSON());
  scene.addObjectFromJSON(object2.toJSON());
  scene.addObjectFromJSON(object3.toJSON());
  
  const objsJSON: Array<IObjectsCommonJSON> = scene.toJSON();
  const objs = objsJSON.map(jsonElement => ObjectFactory.newFromJSON(jsonElement));
  expect(objs.length).toEqual(3);
  scene.removeObject(objsJSON[1]); //remove object2
  return scene.getSceneAsync().then( scene => {
    expect(scene.children.length).toEqual(2);
    expect((scene.children[0] as THREE.Mesh).geometry).toBeInstanceOf(THREE.CubeGeometry);
    expect((scene.children[1] as THREE.Mesh).geometry).toBeInstanceOf(THREE.SphereGeometry);
  });
});

test('Scene.updateFromJSON() - ', () => {
  
  const color = '#abcdef'
  const visible = true;
  const name = 'Object123';
  const highlighted = false;
  const x = 5; const y = 10; const z = 20;
  const axis = 'z'; const angle = 30;

  const object1 = new Cube(
    { width:3*width, height:2*height, depth:5*depth },
    [
      ObjectsCommon.createTranslateOperation(2*x,3*y,5*z),
      ObjectsCommon.createRotateOperation('y', 2*angle)
    ],
    ObjectsCommon.createViewOptions(color,visible,highlighted,name)
    );

  const object2 = new Cube(
    { width, height, depth },
    [
      ObjectsCommon.createTranslateOperation(x,y,z),
      ObjectsCommon.createRotateOperation(axis, angle)
    ],
    ObjectsCommon.createViewOptions(color,visible,highlighted,name)
    );

    const object3 = new Cube(
      { width:5*width, height:5*height, depth:5*depth },
      [
        ObjectsCommon.createTranslateOperation(5*x,5*y,5*z),
        ObjectsCommon.createRotateOperation('y', 5*angle)
      ],
      ObjectsCommon.createViewOptions(color,visible,highlighted,name)
      );


  const json1 = object1.toJSON();
  const json2 = object2.toJSON();
  const json3 = object3.toJSON();
  
  const scene = new Scene();
  scene.addObjectFromJSON(json1);
  scene.addObjectFromJSON(json2);
  scene.addObjectFromJSON(json3);

  const bitbloqscene:Array<ObjectsCommon> = (scene as any).BitbloqScene;
  const objectsCollector:Array<ObjectsCommon> = (scene as any).objectCollector;
  expect(bitbloqscene.length).toEqual(3);
  expect(objectsCollector.length).toEqual(3);

  const obj = objectsCollector[1];
  const obj_a = objectsCollector[0];
  const obj_b = objectsCollector[2];
  expect((obj as any).parameters.width).toEqual(width);
  const aux_obj:ICubeJSON = obj.toJSON() as ICubeJSON;
  aux_obj.parameters.width = 100;
  
  scene.updateObject(aux_obj);
  expect((obj as any).parameters.width).toEqual(100);
  expect((obj_a as any).parameters.width).toEqual(3*width);
  expect((obj_b as any).parameters.width).toEqual(5*width);
});