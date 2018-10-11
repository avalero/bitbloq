import {OperationsArray, Object3D} from './Object3D';
import isEqual from'lodash.isequal';

export type ChildrenArray = Array<Object3D>

export default class CompoundObject extends Object3D {

  protected children: ChildrenArray;

  constructor(children: ChildrenArray = [], operations: OperationsArray = []){
    super(operations);
    this.children = children;
    this._updateRequired = true;
    this.mesh = this.getMesh(); 
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

  get updateRequired():boolean{
    this.children.forEach( child => {
      this._updateRequired = this._updateRequired || child.updateRequired;
    });

    return this._updateRequired;
  }
}
