import Cube from '../Cube';
import Cylinder from '../Cylinder';
import ObjectFactory from '../ObjectFactory';
import Sphere from '../Sphere';
import Prism from '../Prism';
import Union from '../Union';

const width = 10;
const height = 20;
const depth = 30;

const r0 = 4;
const r1 = 6;
const radius = 8;

const sides = 5;
const length = 3;

test('Check Cube is well created from ObjectFactory', () => {
  const object1 = new Cube({ width, height, depth });
  const json = object1.toJSON();
  const object: Cube = ObjectFactory.newFromJSON(json) as Cube;
  expect((object as any).parameters.width).toBe(width);
  expect((object as any).parameters.height).toBe(height);
  expect((object as any).parameters.depth).toBe(depth);
  expect(object1.getID()).not.toEqual(object.getID());
});

test('Check Cylinder is well created from ObjectFactory', () => {
  const object1 = new Cylinder({ r0, r1, height });
  const json = object1.toJSON();
  const object: Cylinder = ObjectFactory.newFromJSON(json) as Cylinder;
  expect((object as any).parameters.r0).toBe(r0);
  expect((object as any).parameters.height).toBe(height);
  expect((object as any).parameters.r1).toBe(r1);
  expect(object1.getID()).not.toEqual(object.getID());
});

test('Check Sphere is well created from ObjectFactory', () => {
  const object1 = new Sphere({ radius });
  const json = object1.toJSON();
  const object = ObjectFactory.newFromJSON(json);
  expect((object as any).parameters.radius).toBe(radius);
  expect(object1.getID()).not.toEqual(object.getID());
});

test('Check Prism is well created from ObjectFactory', () => {
  const object1 = new Prism({ sides, length, height });
  const json = object1.toJSON();
  const object = ObjectFactory.newFromJSON(json);
  expect((object as any).parameters.sides).toBe(sides);
  expect((object as any).parameters.height).toBe(height);
  expect((object as any).parameters.length).toBe(length);
  expect(object1.getID()).not.toEqual(object.getID());
});
