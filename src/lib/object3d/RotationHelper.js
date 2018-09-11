import * as Three from 'three';

export default class RotationHelper {

  constructor(mesh, axis, relative = true) {
    
    this.axesHelper = new Three.AxesHelper(20);
    this.axesHelper.position.copy(mesh.position);

    if (relative) {
      this.axesHelper.setRotationFromEuler(this.mesh.rotation);
    }
  }

  get mesh() {
    return this.axesHelper;
  }
}
