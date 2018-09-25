import * as Three from 'three';

import CompoundObject from './CompoundObject';
import {ThreeBSP} from './threeCSG';

export default class Union extends CompoundObject {
  static typeName = 'Union';

  getMesh() {
    // First element of array
    let unionMeshBSP = new ThreeBSP(this.children[0].getMesh());

    // Union with the rest
    for (let i = 1; i < this.children.length; i += 1) {
      const bspMesh = new ThreeBSP(this.children[i].getMesh());
      unionMeshBSP = unionMeshBSP.union(bspMesh);
    }

    const mesh = unionMeshBSP.toMesh(this.getMaterial());
    //we need to apply the scale of first objet (or we loose it)
    mesh.scale.set(
      this.children[0].getMesh().scale.x,
      this.children[0].getMesh().scale.y,
      this.children[0].getMesh().scale.z,
    );

    this.applyOperations(mesh);

    return mesh;
  }
}
