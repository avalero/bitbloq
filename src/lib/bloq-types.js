import {bloqTypes} from '../data/bloq-types.json';

export function resolveType(name) {
  return bloqTypes.find((type) => type.name === name);
}
