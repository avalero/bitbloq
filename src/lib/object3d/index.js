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

export function createFromJSON(json) {
  const Class3D = resolveClass(json.type);
  return new Class3D(json.name, json.parameters, json.operations, json.id);
}
