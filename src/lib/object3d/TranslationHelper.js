import * as Three from 'three';
import { ThreeBSP } from './threeCSG';

export default class TranslationHelper {
  constructor(mesh, axis, relative) {
    console.log(`Translate: ${axis}`);

    const bbox = new Three.Box3().setFromObject(mesh);
    const radius = 0.5;
    let length;
    let color;
    const separation = 3;
    const inner_lenght = 20;

    if (axis === 'x') {
      color = 0xff0000;
      length = bbox.getSize().x + inner_lenght;
    } else if (axis === 'y') {
      color = 0x0000ff;
      length = bbox.getSize().y + inner_lenght;
    } else {
      color = 0x00ff00;
      length = bbox.getSize().z + inner_lenght;
    }

    const cylinderGeometry = new Three.CylinderGeometry(radius, radius, length);
    cylinderGeometry.rotateZ(Math.PI / 2);
    cylinderGeometry.translate( (length  + inner_lenght) / 2 + separation, 0, 0);

    const arrowGeometry = new Three.CylinderGeometry(2 * radius, 0, 5, 20);
    arrowGeometry.rotateZ(Math.PI / 2);
    arrowGeometry.translate((length  + inner_lenght) / 2 + separation, 0, 0);

    let cylinderBSPGeometry = new ThreeBSP(cylinderGeometry);
    const arrowBSPGeometry = new ThreeBSP(arrowGeometry);
    cylinderBSPGeometry = cylinderBSPGeometry.union(arrowBSPGeometry);

    const material = new Three.MeshBasicMaterial({
      color, opacity: 0.5, transparent: true, depthWrite: false,
    });


    this.helperMesh = cylinderBSPGeometry.toMesh(material);
    this.helperMesh.position.copy(mesh.position);

    if (relative === true) {
      this.helperMesh.setRotationFromEuler(mesh.rotation);
    }

    if (axis === 'y') this.helperMesh.rotateZ(Math.PI / 2);
    if (axis === 'z') {
      this.helperMesh.rotateY(-Math.PI / 2);
      this.helperMesh.rotateX(Math.PI / 2);
    }
  }

  get mesh() {
    return this.helperMesh;
  }
}
