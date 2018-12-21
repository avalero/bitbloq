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

test("Scene - Undo - 2 steps", () => {
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
