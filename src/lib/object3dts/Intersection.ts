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
 * Created at     : 2018-10-16 12:59:53 
 * Last modified  : 2018-11-16 17:46:18
 */


import CompoundObject, { ICompountObjectJSON, ChildrenArray} from './CompoundObject';
import Object3D from './Object3D'
import {OperationsArray} from './ObjectsCommon'


export default class Intersection extends CompoundObject {
  static typeName:string = 'Intersection';

  constructor(children: ChildrenArray = [], operations: OperationsArray = []){
    super(children, operations);
    this.type = Intersection.typeName;
  }


  // public getMesh():THREE.Mesh {
  //   if(this.updateRequired){
  //     console.log("Recompute Mesh Intersection");
  //     // First element of array
  //     let intersectionMeshBSP = new ThreeBSP(this.children[0].getMesh());
      
  //     // Union with the rest
  //     for (let i = 1; i < this.children.length; i += 1) {
  //       const bspMesh = new ThreeBSP(this.children[i].getMesh());
  //       intersectionMeshBSP = intersectionMeshBSP.intersect(bspMesh);
  //     }
  //     this.mesh = intersectionMeshBSP.toMesh(this.getMaterial());
  //     //we need to apply the scale of first objet (or we loose it)
  //     this.mesh.scale.set(
  //       this.children[0].getMesh().scale.x,
  //       this.children[0].getMesh().scale.y,
  //       this.children[0].getMesh().scale.z,
  //     );
  //     this._updateRequired = false;
  //   }

  //   if (this.pendingOperation){
  //     this.applyOperations();
  //   }
  
  //   return this.mesh;
  // }

  public clone():Intersection{
    const childrenClone: Array<Object3D> = this.children.map( child => child.clone());
    return new Intersection(childrenClone, this.operations);
  }
}
