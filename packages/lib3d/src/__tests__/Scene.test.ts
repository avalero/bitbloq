import "jsdom-worker";
import Scene from "../Scene";
import Cube from "../Cube";

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

  scene.addNewObjectFromJSON(cube.toJSON());

  (scene as any).historyIndex = 0;

  expect(scene.canRedo()).toEqual(true);
  expect(scene.canUndo()).toEqual(true);
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
});
