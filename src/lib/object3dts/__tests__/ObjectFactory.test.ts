import Cube from '../Cube';
import ObjectFactory from '../ObjectFactory';

const width = 10;
const height = 20;
const depth = 30;

test('Check object is well created from ObjectFactory', () =>{
  const object1 = new Cube({width, height, depth});
  const json = object1.toJSON();
  const object:Cube = ObjectFactory.newFromJSON(json) as Cube;
  expect((object as any).parameters.width).toBe(width);
  expect((object as any).parameters.height).toBe(height);
  expect((object as any).parameters.depth).toBe(depth);
  expect(object1.getID()).not.toEqual(object.getID());
});