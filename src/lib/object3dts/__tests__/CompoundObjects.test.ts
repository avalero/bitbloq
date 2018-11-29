import 'jsdom-worker';
import 'jest-fetch-mock';

import Union from '../Union';
import Difference from '../Difference';
import Intersection from '../Intersection';

import Cube from '../Cube';
import Sphere from '../Sphere';
import * as THREE from 'three';

const radius = 5;
const width = 7;
const height = 5;
const depth = 10;

// test('Union of basic shapes', () => {
//   const object1 = new Cube({ width, height, depth });
//   const object2 = new Sphere({ radius });

//   const union = new Union([object1, object2]);
//   expect(union.meshUpdateRequired).toBe(true);
//   return union.getMeshAsync().then(mesh => {
//     expect(1).toBe(1);
//   })
// });

// test('Union clone', () => {
//   const object1 = new Cube({ width, height, depth });
//   const object2 = new Sphere({ radius });

//   const union = new Union([object1, object2]);
//   expect(union.meshUpdateRequired).toBe(true);
// });

test('', () => {
  expect(1).toBe(1);
});
