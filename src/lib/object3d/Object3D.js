import * as Three from 'three';

export default class Object3D {
  static parameterTypes = [];

  operations = [];

  constructor(parameters) {
    this.parameters = parameters;
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
}
