import * as Three from 'three';

export default class RotationHelper {
  constructor(mesh, axis, relative) {
    const boundingBoxDims = new Three.Vector3();
    new Three.Box3().setFromObject(mesh).getSize(boundingBoxDims);
    const radius = 0.5;
    let color;
    const separation = 10;
    let length;
    const extraLength = 30;
    let toroidRadius;
    const toroidArc = 2 * Math.PI;
    const toroidInnerRadius = 0.7;

    if (axis === 'x') {
      color = 0xff0000;
      toroidRadius = Math.max(boundingBoxDims.y, boundingBoxDims.z) / 2 + separation;
      length = Math.max(boundingBoxDims.y, boundingBoxDims.z) + extraLength;
    } else if (axis === 'y') {
      color = 0x0000ff;
      toroidRadius = Math.max(boundingBoxDims.x, boundingBoxDims.z) / 2 + separation;
      length = Math.max(boundingBoxDims.x, boundingBoxDims.z) + extraLength;
    } else {
      color = 0x00ff00;
      toroidRadius = Math.max(boundingBoxDims.x, boundingBoxDims.y) / 2 + separation;
      length = Math.max(boundingBoxDims.x, boundingBoxDims.y) + extraLength;
    }

    const cylinderGeometry = new Three.CylinderGeometry(radius, radius, length);
    cylinderGeometry.rotateZ(Math.PI / 2);

    const toroidGeometry = new Three.TorusGeometry(
      toroidRadius,
      toroidInnerRadius,
      6,
      toroidRadius * 2, // lets make number of segments equal to radius * factor
      toroidArc,
    );

    toroidGeometry.rotateY(Math.PI / 2);

    let cylinderBSPGeometry = new ThreeBSP(cylinderGeometry);
    const toroidBSPGeometry = new ThreeBSP(toroidGeometry);
    cylinderBSPGeometry = cylinderBSPGeometry.union(toroidBSPGeometry);

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
