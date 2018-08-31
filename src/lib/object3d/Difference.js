import * as Three from 'three';

import CompoundObject from './CompoundObject';
import { ThreeBSP } from './threeCSG';

export default class Difference extends CompoundObject {
  getMesh() {
    // First element of array
    let differenceMeshBSP = new ThreeBSP(this.children[0].getMesh());

    // Difference with the rest
    for (let i = 1; i < this.children.length; i += 1) {
      const bspMesh = new ThreeBSP(this.children[i].getMesh());
      differenceMeshBSP = differenceMeshBSP.subtract(bspMesh);
    }

    const mesh = differenceMeshBSP.toMesh(new Three.MeshLambertMaterial({color: 0xff0000}));
    this.locateMesh(mesh);
    return mesh;
  }
}
