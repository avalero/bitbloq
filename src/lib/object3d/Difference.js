import * as Three from 'three';

import CompoundObject from './CompoundObject';
import { ThreeBSP } from './threeCSG';

export default class Difference extends CompoundObject {
  getGeometry() {
    // First element of array
    let differenceMeshBSP = new ThreeBSP(this.children[0].getGeometry());

    // Difference with the rest
    for (let i = 1; i < this.children.length; i += 1) {
      const bspMesh = new ThreeBSP(this.children[i].getGeometry());
      differenceMeshBSP = differenceMeshBSP.subtract(bspMesh);
    }
    return differenceMeshBSP.toGeometry();
  }
}
