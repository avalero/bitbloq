/**
 * Copyright (c) 2018 Bitbloq (BQ)
 *
 * License: MIT
 *
 * long description for the file
 *
 * @summary short description for the file
 * @author David García <https://github.com/empoalp>, Alberto Valero <https://github.com/avalero>
 *
 * Created at     : 2018-10-16 13:00:00 
 * Last modified  : 2018-10-16 13:00:00 
 */



import * as THREE from 'three';

import CompoundObject from './CompoundObject';
import {ChildrenArray} from './Object3D'
import {ThreeBSP} from './threeCSG';

export default class Difference extends CompoundObject {
  static typeName:string = 'Difference';

  constructor(children: ChildrenArray = [], operations: OperationsArray = []){
    super(children, operations);
  }

  public getMesh():THREE.Mesh {
    if(this.updateRequired){
      console.log("Recompute Mesh Difference");
      // First element of array
      let differenceMeshBSP = new ThreeBSP(this.children[0].getMesh());
      
      // Union with the rest
      for (let i = 1; i < this.children.length; i += 1) {
        const bspMesh = new ThreeBSP(this.children[i].getMesh());
        differenceMeshBSP = differenceMeshBSP.subtract(bspMesh);
      }
      this.mesh = differenceMeshBSP.toMesh(this.getMaterial());
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
