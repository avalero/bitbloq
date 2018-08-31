import * as Three from 'three';

import CompoundObject from './CompoundObject';
import { ThreeBSP } from './threeCSG';

export default class Intersection extends CompoundObject {
  getMesh() {
    // First element of array
    let intersectionMeshBSP = new ThreeBSP(this.children[0].getGeometry());
    // Intersect with the rest
    for (let i = 1; i < this.children.length; i += 1) {
      const bspMesh = new ThreeBSP(this.children[i].getMesh());
      intersectionMeshBSP = intersectionMeshBSP.intersect(bspMesh);
    }
    const mesh = intersectionMeshBSP.toMesh(new Three.MeshLambertMaterial({color: 0xff0000}));

    this.locateMesh(mesh);
    return mesh;
  }
}
