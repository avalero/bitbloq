import ObjectsGroups from '../ObjectsGroup'

import Cube from '../Cube';
import {Object3D} from '../Object3D';
import RepetitionObject from '../RepetitionObject';

const width = 7;
const height = 5;
const depth = 10;

test('Check addition of objects to Group', () => {
  const object1:Cube = new Cube({width, height, depth});
  const repetion:RepetitionObject = new RepetitionObject({type:'cartesian',x:10,y:0,z:0, num: 10}, object1);

  return repetion.getMeshAsync().then( meshGroup => {
    expect(meshGroup.children.length).toBe(10);
  })
});
