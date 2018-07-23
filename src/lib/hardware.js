import {boards} from '../data/boards.json';
import {components} from '../data/components.json';

const componentClasses = {};

components.forEach(component => {
  const baseClass = component.extends && componentClasses[component.extends];

  const componentClass = {
    ...baseClass,
    ...component,
    baseClass,
    getCode: section => {
      const code = (component.code && component.code[section]) || [];
      return baseClass ? [...baseClass.getCode(section), ...code] : code;
    },
    isInstanceOf: name => {
      if (name === component.name) {
        return true;
      } else if (baseClass) {
        return baseClass.isInstanceOf(name);
      } else {
        return false;
      }
    }
  };

  componentClasses[component.name] = componentClass;
});

export function resolveBoardClass(name) {
  return boards.find(board => board.name === name);
}

export function resolveComponentClass(name) {
  return componentClasses[name];
}
