import {boards} from '../data/boards.json';
import {components} from '../data/components.json';

const boardClasses = {};

boards.forEach(board => {
  boardClasses[board.name] = board;
});

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
    },
  };

  componentClasses[component.name] = componentClass;
});

export function resolveBoardClass(name) {
  return boardClasses[name];
}

export function resolveComponentClass(name) {
  return componentClasses[name];
}

export function getCompatibleComponents(boardClass) {
  const boardConnectorTypes = new Set();
  const {ports = []} = boardClass;
  ports.forEach(({connectorTypes = []}) => {
    connectorTypes.forEach(type => boardConnectorTypes.add(type));
  });

  return Object.values(componentClasses).filter(({connectors = []}) =>
    connectors.find(({type}) => boardConnectorTypes.has(type)),
  );
}

export function getCompatiblePorts(board, connectorType) {
  const boardClass = resolveBoardClass(board.className);
  const {ports = []} = boardClass;
  return ports.filter(({connectorTypes = []}) =>
    connectorTypes.includes(connectorType),
  );
}

export function getConnectorPosition(component, connectorName) {
  const {x: componentX, y: componentY, className} = component;
  const componentClass = resolveComponentClass(className);
  const {image, connectors} = componentClass;
  const connector = connectors.find(c => c.name === connectorName);
  if (connector) {
    const connectorX = image.width * connector.x;
    const connectorY = image.height * connector.y;
    return {
      x: componentX + connectorX,
      y: componentY + connectorY,
    };
  } else {
    return {x: 0, y: 0};
  }
}

export function getPortPosition(board, portName) {
  const boardClass = resolveBoardClass(board.className);
  const {image, ports} = boardClass;
  const port = ports.find(p => p.name === portName);
  if (port) {
    return {
      x: image.width * (port.x - 0.5),
      y: image.height * (port.y - 0.5),
    };
  } else {
    return {x: 0, y: 0};
  }
}

export function generateInstanceName(componentClass, components = []) {
  const baseName = componentClass.instanceName || componentClass.name;
  let index = 1;
  let name = baseName;

  while (components.find(c => c.name === name)) {
    index++;
    name = `${baseName}_${index}`;
  }

  return name;
}
