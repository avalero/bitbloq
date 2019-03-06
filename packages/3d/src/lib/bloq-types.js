import {bloqTypes as bloqTypesSoftware} from '../data/bloq-types-software.json';
import {bloqTypes as bloqTypes3D} from '../data/bloq-types-3d.json';

export function resolveSoftwareType(name) {
  return bloqTypesSoftware.find((type) => type.name === name);
}

export function resolve3DType(name) {
  return bloqTypes3D.find((type) => type.name === name);
}
