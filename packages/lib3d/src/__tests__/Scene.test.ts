import "jsdom-worker";
import Scene, { ISceneJSON } from "../Scene";
import Cube, { ICubeJSON } from "../Cube";
import RepetitionObject, {
  ICartesianRepetitionParams,
  IRepetitionObjectJSON
} from "../RepetitionObject";

test("Scene - Constructor", () => {
  const scene = new Scene();
  expect((scene as any).objectCollector).toEqual([]);
  expect((scene as any).objectsInScene).toEqual([]);
  expect((scene as any).objectsInTransition).toEqual([]);
  expect((scene as any).history).toEqual([]);
  expect((scene as any).historyIndex).toEqual(-1);
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
