import * as Three from 'three';

import CompoundObject from './CompoundObject';
import { ThreeBSP } from './threeCSG';

export default class Union extends CompoundObject {
  getMesh() {
    // First element of array
    let unionMeshBSP = new ThreeBSP(this.children[0].getMesh());

    // Union with the rest
    for (let i = 1; i < this.children.length; i += 1) {
      const bspMesh = new ThreeBSP(this.children[i].getMesh());
      unionMeshBSP = unionMeshBSP.union(bspMesh);
    }

    const mesh = unionMeshBSP.toMesh(new Three.MeshLambertMaterial({ color: this.children[0].parameters.color }));
    this.locateMesh(mesh);

    return mesh;
  }
}
