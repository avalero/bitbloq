import * as Three from 'three';
import uuid from 'uuid/v1';

export default class Object3D {
  static parameterTypes = [];

  static createTranslateOperation(x, y, z, relative = true) {
    return {
      type: 'translation',
      x,
      y,
      z,
      relative
    };
  }

  id = '';
  name = '';
  parameters = {};
  operations = [];

  constructor(name, parameters = {}, operations = [], id) {
    const defaultParams = {};
    this.constructor.parameterTypes.forEach(paramType => {
      defaultParams[paramType.name] = paramType.defaultValue;
    });
    
    this.parameters = {
      ...defaultParams,
      ...parameters
    };

    this.operations = operations;
    this.id = id || uuid();
    this.name = name;
  }

  addOperation(operation) {
    this.operations.push(operation);
  }

  getMesh() {
    const geometry = this.getGeometry();
    const material = new Three.MeshLambertMaterial({color: 0xff0000});
    const mesh = new Three.Mesh(geometry, material);

    // TODO Apply operations

    return mesh;
  }

  getGeometry() {
    throw new Error('Method not implemented');
  }

  toJSON() {
    const {id, parameters, operations, constructor} = this;
    return {
      id,
      type: constructor.name,
      parameters,
      operations
    };
  }
}
