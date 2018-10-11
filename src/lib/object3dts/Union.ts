import * as THREE from 'three';

import CompoundObject from './CompoundObject';
import {ChildrenArray} from './Object3D'
import {ThreeBSP} from './threeCSG';

export default class Union extends CompoundObject {
  static typeName:string = 'Union';

  constructor(children: ChildrenArray = [], operations: OperationsArray = []){
    super(children, operations);
  }

  public getMesh():THREE.Mesh {
    if(this.updateRequired){
      console.log("Recompute Mesh Union");
      // First element of array
      let unionMeshBSP = new ThreeBSP(this.children[0].getMesh());
      
      // Union with the rest
      for (let i = 1; i < this.children.length; i += 1) {
        const bspMesh = new ThreeBSP(this.children[i].getMesh());
        unionMeshBSP = unionMeshBSP.union(bspMesh);
      }
      this.mesh = unionMeshBSP.toMesh(this.getMaterial());
      //we need to apply the scale of first objet (or we loose it)
      this.mesh.scale.set(
        this.children[0].getMesh().scale.x,
        this.children[0].getMesh().scale.y,
        this.children[0].getMesh().scale.z,
      );
      this._updateRequired = false;
    }

    if (this.pendingOperation){
      this.applyOperations();
    }

  
    return this.mesh;
  }
}
