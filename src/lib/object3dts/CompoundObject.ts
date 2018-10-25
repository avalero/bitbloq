import {OperationsArray, Object3D, ChildrenArray} from './Object3D';
import isEqual from'lodash.isequal';
import * as THREE from 'three';

import Worker from './compound.worker';

export default class CompoundObject extends Object3D {

  protected worker:Worker;

  constructor(children: ChildrenArray = [], operations: OperationsArray = []){
    super(operations);
    this.children = children;
    this._updateRequired = true;
    this.setOperations();
    
    const t0 = performance.now();
    if (typeof(Worker) !== "undefined"){
      this.worker = new Worker();
    }
    const t1 = performance.now();
    console.log(`WebWorker creation time ${t1 - t0} millis`);

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
