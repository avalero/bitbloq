import Cube from './Cube';
import Sphere from './Sphere';
import Union from './Union';

const classes = {
  Cube,
  Sphere,
  Union
};

export function resolveClass(name) {
  return classes[name];
}
