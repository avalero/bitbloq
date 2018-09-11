import * as Three from 'three';
import { ThreeBSP } from './threeCSG';

export default class TranslationHelper {
  constructor(mesh, axis, relative) {
    const boundingBoxDims = new Three.Vector3();
    new Three.Box3().setFromObject(mesh).getSize(boundingBoxDims);
    const radius = 0.3;
    let color;
    const separation = 3;
    const length = 20;
    const arrowLength = 5;
    let offset;
    let offsetArrow;

    if (axis === 'x') {
      color = 0xff0000;
      offset = boundingBoxDims.x / 2 + separation + length / 2;
      offsetArrow = boundingBoxDims.x / 2 + separation + arrowLength / 2 + length;
    } else if (axis === 'y') {
      color = 0x0000ff;
      offset = boundingBoxDims.y / 2 + separation + length / 2;
      offsetArrow = boundingBoxDims.y / 2 + separation + arrowLength / 2 + length;
    } else {
      color = 0x00ff00;
      offset = boundingBoxDims.z / 2 + separation + length / 2;
      offsetArrow = boundingBoxDims.z / 2 + separation + arrowLength / 2 + length;
    }

    const cylinderGeometry = new Three.CylinderGeometry(radius, radius, length);
    cylinderGeometry.rotateZ(Math.PI / 2);
    cylinderGeometry.translate(offset, 0, 0);

    const arrowGeometry = new Three.CylinderGeometry(2 * radius, 0, 5, 20);
    arrowGeometry.rotateZ(Math.PI / 2);
    arrowGeometry.translate(offsetArrow, 0, 0);

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
