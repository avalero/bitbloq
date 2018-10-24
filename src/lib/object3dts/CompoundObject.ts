import {OperationsArray, Object3D, ChildrenArray} from './Object3D';
import isEqual from'lodash.isequal';
import * as THREE from 'three';



export default class CompoundObject extends Object3D {

  constructor(children: ChildrenArray = [], operations: OperationsArray = []){
    super(operations);
    this.children = children;
    this._updateRequired = true;
    this.setOperations();
    // this.getMeshAsync().then(mesh => {
    //   this.mesh = mesh;
    // }).catch(error => {
    //   console.log(error.message);
    //   throw error;
    // }); 
  }

  public addChildren(child: Object3D): void {
    this.children.push(child);
    this._updateRequired = true;
  }

  public setChildren(children: ChildrenArray): void {
    if(!isEqual(children,this.children)){
      this.children = children.slice();
      this._updateRequired = true;
    }
  }


}
