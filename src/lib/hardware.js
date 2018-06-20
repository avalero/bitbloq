import {boards} from '../data/boards.json';
import {components} from '../data/components.json';

export function resolveBoardClass(name) {
  return boards.find((board) => board.name === name);
}

export function resolveComponentClass(name) {
  return components.find((component) => component.name === name);
}
