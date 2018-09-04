import CompoundObject from './CompoundObject';
import Cube from './Cube';
import Cylinder from './Cylinder';
import Sphere from './Sphere';
import Prism from './Prism';
import Union from './Union';
import Difference from './Difference';
import Intersection from './Intersection';

const classes = {
  Cube,
  Cylinder,
  Prism,
  Sphere,
  Union,
  Difference,
  Intersection,
};

export function resolveClass(name) {
  return classes[name];
}

export function createFromJSON(json) {
  const Class3D = resolveClass(json.type);

  if (Class3D.prototype instanceof CompoundObject) {
    const {parameters = {}} = json;
    const {children = []} = parameters;
    return Class3D.createFromJSON({
      ...json,
      parameters: {
        ...parameters,
        children: children.map(child => createFromJSON(child)),
      },
    });
  } else {
    return Class3D.createFromJSON(json);
  }
}
