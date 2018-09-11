import * as Three from 'three';

export default class TranslationHelper {
  constructor(mesh, axis, relative) {
    this.axesHelper = new Three.AxesHelper(20);
    this.axesHelper.position.copy(mesh.position);

    console.log(`axis: ${axis}`);

    const bbox = new Three.Box3().setFromObject(mesh);
    const radius = 0.5;


    let length;
    let color;

    if (axis === 'x') {
      color = 0xff0000;
      length = bbox.getSize().x + 20;
    } else if (axis === 'y') {
      color = 0x0000ff;
      length = bbox.getSize().y + 20;
    } else {
      color = 0x00ff00;
      length = bbox.getSize().z + 20;
    }

    const cylinderGeometry = new Three.CylinderGeometry(radius, radius, length);
    cylinderGeometry.rotateZ(Math.PI / 2);
    cylinderGeometry.translate(length / 2, 0, 0);

    const material = new Three.MeshBasicMaterial({
      color, opacity: 0.5, transparent: true, depthWrite: false,
    });
    this.helper = new Three.Mesh(cylinderGeometry, material);


    this.helper.position.copy(mesh.position);

    if (relative === true) {
      this.helper.setRotationFromEuler(mesh.rotation);
    }

    if (axis === 'y') this.helper.rotateZ(Math.PI / 2);
    if (axis === 'z') {
      this.helper.rotateY(-Math.PI / 2);
      this.helper.rotateX(Math.PI / 2);
    }
  }

  get mesh() {
    return this.helper;
  }
}
