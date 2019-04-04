import "jsdom-worker";
interface Global {
  fetch: any;
}
const global: Global = { fetch: undefined };
global.fetch = require("jest-fetch-mock");

import Scene, { ISceneJSON } from "../Scene";
import Cube from "../Cube";
import RepetitionObject from "../RepetitionObject";
import ObjectsGroup from "../ObjectsGroup";
import * as THREE from "three";

import {
  ICartesianRepetitionParams,
  IRepetitionObjectJSON,
  ICubeJSON,
  IGeometry
} from "../Interfaces";
import Union from "../Union";

test("Scene - Constructor", () => {
  const spySetupScene = jest.spyOn(Scene.prototype as any, "setupScene");
  const spySetMaterials = jest.spyOn(Scene.prototype as any, "setMaterials");
  const scene = new Scene();

  expect(spySetupScene).toBeCalledTimes(1);
  expect(spySetMaterials).toBeCalledTimes(1);
  expect((scene as any).objectCollector).toEqual([]);
  expect((scene as any).objectsInScene).toEqual([]);
  expect((scene as any).objectsInTransition).toEqual([]);
  expect((scene as any).history).toEqual([]);
  expect((scene as any).historyIndex).toEqual(-1);
  expect((scene as any).sceneSetup).toBeDefined();
  expect((scene as any).selectedMaterial).toBeDefined();
  expect((scene as any).secondaryMaterial).toBeDefined();
  expect((scene as any).normalMaterial).toBeDefined();
  expect((scene as any).transitionMaterial).toBeDefined();
});

test("Scene - Can Redo/Undo", () => {
  const scene = new Scene();
  expect(scene.canRedo()).toEqual(false);
  expect(scene.canUndo()).toEqual(false);

  const cube = new Cube({ width: 10, height: 10, depth: 10 });
  scene.addNewObjectFromJSON(cube.toJSON());

  expect(scene.canRedo()).toEqual(false);
  expect(scene.canUndo()).toEqual(true);

  setTimeout(() => {
    scene.addNewObjectFromJSON(cube.toJSON());

    (scene as any).historyIndex = 0;

    expect(scene.canRedo()).toEqual(true);
    expect(scene.canUndo()).toEqual(true);
  }, 1500);
});

test("Scene - Undo - 1 step", () => {
  const scene = new Scene();
  const firstJSON = scene.toJSON();

  const cube = new Cube({ width: 10, height: 10, depth: 10 });
  scene.addNewObjectFromJSON(cube.toJSON());

  expect((scene as any).history.length).toEqual(1);
  expect((scene as any).historyIndex).toEqual(0);

  scene.undo();
  const lastJSON = scene.toJSON();

  expect(firstJSON).toEqual(lastJSON);
  expect((scene as any).history.length).toEqual(1);
  expect((scene as any).historyIndex).toEqual(-1);
});

test("Scene - Undo - 2 steps", () => {
  const scene = new Scene();
  const firstJSON = scene.toJSON();

  const cube = new Cube({ width: 10, height: 10, depth: 10 });

  scene.addNewObjectFromJSON(cube.toJSON());
  const secondJSON = scene.toJSON();
  expect((scene as any).history.length).toEqual(1);
  expect((scene as any).historyIndex).toEqual(0);

  setTimeout(() => {
    scene.addNewObjectFromJSON(cube.toJSON());
    expect((scene as any).history.length).toEqual(2);
    expect((scene as any).historyIndex).toEqual(1);

    scene.undo();

    expect((scene as any).history.length).toEqual(2);
    expect((scene as any).historyIndex).toEqual(0);

    expect(scene.toJSON()).toEqual(secondJSON);

    scene.undo();

    expect((scene as any).history.length).toEqual(2);
    expect((scene as any).historyIndex).toEqual(-1);

    expect(scene.toJSON()).toEqual(firstJSON);

    const errorfn = () => scene.undo();
    expect(errorfn).toThrowError();
  }, 1500);
});

test("Scene - Redo - 1 step", () => {
  const scene = new Scene();

  const cube = new Cube({ width: 10, height: 10, depth: 10 });
  scene.addNewObjectFromJSON(cube.toJSON());
  const secondJSON = scene.toJSON();

  scene.undo();

  scene.redo();
  expect(scene.toJSON()).toEqual(secondJSON);
  expect((scene as any).history.length).toEqual(1);
  expect((scene as any).historyIndex).toEqual(0);
});

test("Scene - Redo - 2 steps", () => {
  const scene = new Scene();

  const cube = new Cube({ width: 10, height: 10, depth: 10 });

  scene.addNewObjectFromJSON(cube.toJSON());
  const secondJSON = scene.toJSON();

  setTimeout(() => {
    scene.addNewObjectFromJSON(cube.toJSON());
    const thirdJSON = scene.toJSON();
    scene.undo();
    scene.undo();

    scene.redo();

    expect((scene as any).history.length).toEqual(2);
    expect((scene as any).historyIndex).toEqual(1);
    expect(scene.toJSON()).toEqual(secondJSON);

    scene.redo();

    expect((scene as any).history.length).toEqual(2);
    expect((scene as any).historyIndex).toEqual(2);
    expect(scene.toJSON()).toEqual(thirdJSON);

    const errorfn = () => scene.redo();
    expect(errorfn).toThrowError();
  }, 1500);
});

test("Secene.newFromJSON - Simple Objects", () => {
  const cube1 = new Cube({ width: 10, height: 10, depth: 10 });
  const cube2 = new Cube({ width: 20, height: 20, depth: 20 });

  const sceneJSON: ISceneJSON = [cube1.toJSON(), cube2.toJSON()];

  const scene: Scene = Scene.newFromJSON(sceneJSON);

  const computedSceneJSON: ISceneJSON = scene.toJSON();

  expect(computedSceneJSON).toEqual(sceneJSON);

  expect(computedSceneJSON.length).toEqual(2);
  expect(computedSceneJSON[0].type).toEqual(Cube.typeName);
  expect(computedSceneJSON[1].type).toEqual(Cube.typeName);
  expect((computedSceneJSON[0] as ICubeJSON).parameters.width).toEqual(10);
  expect((computedSceneJSON[1] as ICubeJSON).parameters.width).toEqual(20);
  expect((scene as any).objectCollector.length).toEqual(2);
  expect((scene as any).objectsInScene.length).toEqual(2);
});

test("Secene.newFromJSON - Compound Objects", () => {
  const cube1 = new Cube({ width: 10, height: 10, depth: 10 });
  const cube2 = new Cube({ width: 20, height: 20, depth: 20 });

  const repParamas: ICartesianRepetitionParams = {
    type: "cartesian",
    num: 3,
    x: 10,
    y: 10,
    z: 10
  };
  const repetition = new RepetitionObject(repParamas, cube2);

  const sceneJSON: ISceneJSON = [cube1.toJSON(), repetition.toJSON()];

  const scene: Scene = Scene.newFromJSON(sceneJSON);

  const computedSceneJSON: ISceneJSON = scene.toJSON();

  expect(computedSceneJSON).toEqual(sceneJSON);

  expect(computedSceneJSON.length).toEqual(2);
  expect(computedSceneJSON[0].type).toEqual(Cube.typeName);
  expect(computedSceneJSON[1].type).toEqual(RepetitionObject.typeName);
  expect(
    (computedSceneJSON[1] as IRepetitionObjectJSON).children[0].type
  ).toEqual(Cube.typeName);
  expect((computedSceneJSON[0] as ICubeJSON).parameters.width).toEqual(10);
  expect(
    ((computedSceneJSON[1] as IRepetitionObjectJSON)
      .parameters as ICartesianRepetitionParams).num
  ).toEqual(3);
  expect((scene as any).objectCollector.length).toEqual(3);
  expect((scene as any).objectsInScene.length).toEqual(2);
});

test("Secene.newFromJSON - Two level Compound Objects", () => {
  const cube1 = new Cube({ width: 10, height: 10, depth: 10 });
  const cube2 = new Cube({ width: 20, height: 20, depth: 20 });

  const repParams: ICartesianRepetitionParams = {
    type: "cartesian",
    num: 3,
    x: 10,
    y: 10,
    z: 10
  };
  const repetition1 = new RepetitionObject(repParams, cube2);
  const repetition2 = new RepetitionObject(repParams, repetition1);

  const sceneJSON: ISceneJSON = [cube1.toJSON(), repetition2.toJSON()];

  const scene: Scene = Scene.newFromJSON(sceneJSON);

  const computedSceneJSON: ISceneJSON = scene.toJSON();

  expect(computedSceneJSON).toEqual(sceneJSON);

  expect(computedSceneJSON.length).toEqual(2);
  expect(computedSceneJSON[0].type).toEqual(Cube.typeName);
  expect(computedSceneJSON[1].type).toEqual(RepetitionObject.typeName);
  expect(
    (computedSceneJSON[1] as IRepetitionObjectJSON).children[0].type
  ).toEqual(RepetitionObject.typeName);
  expect((computedSceneJSON[0] as ICubeJSON).parameters.width).toEqual(10);
  expect(
    ((computedSceneJSON[1] as IRepetitionObjectJSON)
      .parameters as ICartesianRepetitionParams).num
  ).toEqual(repParams.num);
  expect((scene as any).objectCollector.length).toEqual(4);
  expect((scene as any).objectsInScene.length).toEqual(2);
});

test("Scene AddNewObjectFromJSON", () => {
  const cube1 = new Cube({ width: 10, height: 10, depth: 10 });
  const cube2 = new Cube({ width: 20, height: 20, depth: 20 });

  const repParams: ICartesianRepetitionParams = {
    type: "cartesian",
    num: 3,
    x: 10,
    y: 10,
    z: 10
  };

  const repetition1 = new RepetitionObject(repParams, cube2);
  const repetition2 = new RepetitionObject(repParams, repetition1);

  const group = new ObjectsGroup([cube1, repetition2]);

  const scene: Scene = new Scene();
  scene.addNewObjectFromJSON(cube1.toJSON());
  scene.addNewObjectFromJSON(cube2.toJSON());
  scene.addNewObjectFromJSON(repetition1.toJSON());
  scene.addNewObjectFromJSON(repetition2.toJSON());
  const sceneJSON = scene.addNewObjectFromJSON(group.toJSON());

  const expectedSceneJSON: ISceneJSON = [group.toJSON()];

  expect(sceneJSON).toEqual(expectedSceneJSON);

  expect((scene as any).objectCollector.length).toEqual(5);
  expect((scene as any).objectsInScene.length).toEqual(1);

  expect((scene as any).objectInObjectCollector(cube1.toJSON())).toBe(true);
  expect((scene as any).objectInScene(cube1.toJSON())).toBe(false);

  expect((scene as any).objectInObjectCollector(group.toJSON())).toBe(true);
  expect((scene as any).objectInScene(group.toJSON())).toBe(true);
});

test("Scene - RemoveFromObjectCollector", () => {
  const cube1 = new Cube({ width: 10, height: 10, depth: 10 });
  const cube2 = new Cube({ width: 20, height: 20, depth: 20 });

  const repParams: ICartesianRepetitionParams = {
    type: "cartesian",
    num: 3,
    x: 10,
    y: 10,
    z: 10
  };
  const repetition1 = new RepetitionObject(repParams, cube2);
  const repetition2 = new RepetitionObject(repParams, repetition1);

  const group = new ObjectsGroup([cube1, repetition2]);

  const scene: Scene = new Scene();
  scene.addNewObjectFromJSON(cube1.toJSON());
  scene.addNewObjectFromJSON(cube2.toJSON());
  scene.addNewObjectFromJSON(repetition1.toJSON());
  scene.addNewObjectFromJSON(repetition2.toJSON());
  scene.addNewObjectFromJSON(group.toJSON());

  expect((scene as any).objectCollector.length).toEqual(5);

  expect((scene as any).objectInObjectCollector(cube1.toJSON())).toBe(true);
  (scene as any).removeFromObjectCollector(cube1.toJSON());
  expect((scene as any).objectInObjectCollector(cube1.toJSON())).toBe(false);

  expect((scene as any).objectInObjectCollector(cube2.toJSON())).toBe(true);
  expect((scene as any).objectInObjectCollector(repetition1.toJSON())).toBe(
    true
  );
  (scene as any).removeFromObjectCollector([
    cube2.toJSON(),
    repetition1.toJSON()
  ]);
  expect((scene as any).objectInObjectCollector(cube2.toJSON())).toBe(false);
  expect((scene as any).objectInObjectCollector(repetition1.toJSON())).toBe(
    false
  );
});

test("Scene - RemoveFromScene", () => {
  const cube1 = new Cube({ width: 10, height: 10, depth: 10 });
  const cube2 = new Cube({ width: 20, height: 20, depth: 20 });
  const cube3 = new Cube({ width: 20, height: 20, depth: 20 });
  const cube4 = new Cube({ width: 20, height: 20, depth: 20 });

  const repParams: ICartesianRepetitionParams = {
    type: "cartesian",
    num: 3,
    x: 10,
    y: 10,
    z: 10
  };
  const repetition1 = new RepetitionObject(repParams, cube2);
  const repetition2 = new RepetitionObject(repParams, repetition1);

  const group = new ObjectsGroup([cube1, repetition2]);

  const scene: Scene = new Scene();
  scene.addNewObjectFromJSON(cube1.toJSON());
  scene.addNewObjectFromJSON(cube2.toJSON());
  scene.addNewObjectFromJSON(cube3.toJSON());
  scene.addNewObjectFromJSON(cube4.toJSON());

  scene.addNewObjectFromJSON(repetition1.toJSON());
  scene.addNewObjectFromJSON(repetition2.toJSON());
  scene.addNewObjectFromJSON(group.toJSON());

  expect((scene as any).objectCollector.length).toEqual(7);
  expect((scene as any).objectsInScene.length).toEqual(3);

  // Remove Object not present in Scene
  expect((scene as any).objectInScene(cube1.toJSON())).toBe(false);
  const a = () => (scene as any).removeFromScene(cube1.toJSON());
  expect(a).toThrowError();

  // Remove Object present in Scene
  expect((scene as any).objectInScene(cube3.toJSON())).toBe(true);
  (scene as any).removeFromScene(cube3.toJSON());
  expect((scene as any).objectInScene(cube3.toJSON())).toBe(false);
  expect((scene as any).objectCollector.length).toEqual(7);
  expect((scene as any).objectsInScene.length).toEqual(2);

  // Remove Array of Objects present in Scene
  expect((scene as any).objectInScene(cube4.toJSON())).toBe(true);
  expect((scene as any).objectInScene(group.toJSON())).toBe(true);
  (scene as any).removeFromScene([cube4.toJSON(), group.toJSON()]);
  expect((scene as any).objectInScene(cube4.toJSON())).toBe(false);
  expect((scene as any).objectInScene(group.toJSON())).toBe(false);

  expect((scene as any).objectCollector.length).toEqual(7);
  expect((scene as any).objectsInScene.length).toEqual(0);
});

test("Scene - getObjectsAsync", async () => {
  const cube1 = new Cube({ width: 10, height: 10, depth: 10 });
  const cube2 = new Cube({ width: 20, height: 20, depth: 20 });
  const cube3 = new Cube({ width: 20, height: 20, depth: 20 });
  const cube4 = new Cube({ width: 20, height: 20, depth: 20 });

  const spy = jest.spyOn(Scene.prototype, "testPoint");

  const scene: Scene = new Scene();
  scene.addNewObjectFromJSON(cube1.toJSON());
  scene.addNewObjectFromJSON(cube2.toJSON());

  const objects: THREE.Group = await scene.getObjectsAsync();
  expect(spy).toBeCalledTimes(1);
  expect(objects.children.length).toEqual(2);
  expect(objects.children[0]).toBeInstanceOf(THREE.Mesh);

  // testPoint should not be recalled if scene is unchanged
  const objects2: THREE.Group = await scene.getObjectsAsync();
  expect(spy).toBeCalledTimes(1);

  // testPoint should be called again as scene has changed
  scene.addNewObjectFromJSON(cube3.toJSON());
  scene.addNewObjectFromJSON(cube4.toJSON());
  const objects3: THREE.Group = await scene.getObjectsAsync();
  expect(spy).toBeCalledTimes(2);
  expect(objects3.children.length).toEqual(4);
});

test("Scene - addExistingGroup", async () => {
  const cube1 = new Cube({ width: 10, height: 10, depth: 10 });
  const cube2 = new Cube({ width: 20, height: 20, depth: 20 });
  const cube3 = new Cube({ width: 20, height: 20, depth: 20 });
  const cube4 = new Cube({ width: 20, height: 20, depth: 20 });

  const group = new ObjectsGroup([cube1, cube2, cube3, cube4]);
  const scene: Scene = new Scene();

  const spy = jest.spyOn(Scene.prototype as any, "addExistingGroup");
  scene.addNewObjectFromJSON(cube1.toJSON());
  scene.addNewObjectFromJSON(cube2.toJSON());
  scene.addNewObjectFromJSON(cube3.toJSON());
  scene.addNewObjectFromJSON(cube4.toJSON());
  scene.addNewObjectFromJSON(group.toJSON());
  const objects: THREE.Group = await scene.getObjectsAsync();

  expect(spy).toBeCalledTimes(1);
  expect(objects.children.length).toEqual(1);
  expect(objects.children[0]).toBeInstanceOf(THREE.Group);
  expect((scene as any).objectsInScene[0]).toBeInstanceOf(ObjectsGroup);
});

test("Scene - addExistingRepetition", async () => {
  const cube = new Cube({ width: 10, height: 10, depth: 10 });

  const repParams: ICartesianRepetitionParams = {
    type: "cartesian",
    num: 3,
    x: 10,
    y: 10,
    z: 10
  };
  const repetition = new RepetitionObject(repParams, cube);
  const scene: Scene = new Scene();

  const spy = jest.spyOn(Scene.prototype as any, "addExistingRepetition");
  scene.addNewObjectFromJSON(cube.toJSON());
  scene.addNewObjectFromJSON(repetition.toJSON());
  const objects: THREE.Group = await scene.getObjectsAsync();

  expect(spy).toBeCalledTimes(1);
  expect(objects.children.length).toEqual(1);
  expect(objects.children[0]).toBeInstanceOf(THREE.Group);
  expect((scene as any).objectsInScene[0]).toBeInstanceOf(RepetitionObject);
});

test("Scene - repetitionToGroup", async () => {
  const cube = new Cube({ width: 10, height: 10, depth: 10 });

  const repParams: ICartesianRepetitionParams = {
    type: "cartesian",
    num: 3,
    x: 10,
    y: 10,
    z: 10
  };
  const repetition = new RepetitionObject(repParams, cube);
  const scene: Scene = new Scene();

  (scene as any).addExistingObject(repetition);
  scene.convertToGroup(repetition.toJSON());

  const objects: THREE.Group = await scene.getObjectsAsync();

  expect(objects.children.length).toEqual(1);
  expect(objects.children[0]).toBeInstanceOf(THREE.Group);
  expect((scene as any).objectsInScene[0]).toBeInstanceOf(ObjectsGroup);
});

test("Scene - unGroup", async () => {
  const cube1 = new Cube({ width: 10, height: 10, depth: 10 });
  const cube2 = new Cube({ width: 20, height: 20, depth: 20 });
  const cube3 = new Cube({ width: 20, height: 20, depth: 20 });
  const cube4 = new Cube({ width: 20, height: 20, depth: 20 });

  const group = new ObjectsGroup([cube1, cube2, cube3, cube4]);
  const scene: Scene = new Scene();

  (scene as any).addExistingObject(group);
  (scene as any).unGroup(group.toJSON());

  const objects: THREE.Group = await scene.getObjectsAsync();

  expect(objects.children.length).toEqual(4);
  expect(objects.children[0]).toBeInstanceOf(THREE.Mesh);
  expect((scene as any).objectsInScene[0]).toBeInstanceOf(Cube);
  expect((scene as any).objectsInScene[0]).toBe(cube1);
});

test("Scene - undoRepetition", async () => {
  const cube = new Cube({ width: 10, height: 10, depth: 10 });

  const repParams: ICartesianRepetitionParams = {
    type: "cartesian",
    num: 3,
    x: 10,
    y: 10,
    z: 10
  };
  const repetition = new RepetitionObject(repParams, cube);
  const scene: Scene = new Scene();

  scene.addNewObjectFromJSON(cube.toJSON());
  scene.addNewObjectFromJSON(repetition.toJSON());
  scene.undoObject(repetition.toJSON());

  const objects: THREE.Group = await scene.getObjectsAsync();

  expect(objects.children.length).toEqual(1);
  expect(objects.children[0]).toBeInstanceOf(THREE.Mesh);
  expect((scene as any).objectsInScene[0]).toBeInstanceOf(Cube);
});

test("Scene - getGeometries", async () => {
  const cube = new Cube({ width: 10, height: 10, depth: 10 });
  const mesh = (await cube.getMeshAsync()) as THREE.Mesh;
  const vertices = [10, 20, 30];
  const normals = [40, 50, 60];
  mesh.userData.vertices = vertices;
  mesh.userData.normals = normals;

  const cube2: Cube = cube.clone();

  const union = new Union([cube, cube2], [], {}, mesh);

  const geometry: IGeometry = union.getGeometryData();

  expect(geometry.id).toEqual(union.getID());
  expect(geometry.vertices).toBe(vertices);
  expect(geometry.normals).toBe(normals);

  const scene: Scene = new Scene();
  (scene as any).objectCollector.push(cube);
  (scene as any).objectCollector.push(cube2);
  (scene as any).objectCollector.push(union);
  (scene as any).objectsInScene.push(union);

  const geometries: IGeometry[] = scene.getGeometries();

  expect(geometries.length).toEqual(1);
  expect(geometries[0].vertices).toBe(vertices);
  expect(geometries[0].normals).toBe(normals);
});
