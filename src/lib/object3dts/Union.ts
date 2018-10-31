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
 * Created at     : 2018-10-16 13:00:09 
 * Last modified  : 2018-10-24 20:44:21
 */



import CompoundObject from './CompoundObject';
import {ChildrenArray, OperationsArray} from './Object3D'



export default class Union extends CompoundObject {
  static typeName:string = 'Union';

  constructor(children: ChildrenArray = [], operations: OperationsArray = []){
    super(children, operations);
  }


  public getTypeName():string{
    return Union.typeName;
  }

  

  // private getUnionMeshBSP():any{
  //   let unionMeshBSP:any = new ThreeBSP(this.children[0].getMesh());  
  //   // Union with the rest
  //   for (let i = 1; i < this.children.length; i += 1) {
  //     const bspMesh = new ThreeBSP(this.children[i].getMesh());
  //     unionMeshBSP = unionMeshBSP.union(bspMesh);
  //   }

  //   return unionMeshBSP;

  // }

  // public getMesh():THREE.Mesh {
  //   if(this.updateRequired){
  //     // First element of array
  //     const unionMeshBSP = this.getUnionMeshBSP();
  //     this.mesh = unionMeshBSP.toMesh(this.getMaterial());
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
}
