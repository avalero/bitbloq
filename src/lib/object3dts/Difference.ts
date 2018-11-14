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
 * Last modified  : 2018-11-14 08:45:27
 */



import CompoundObject from './CompoundObject';
import {ChildrenArray, OperationsArray} from './Object3D'
import Object3D from './Object3D';

export default class Difference extends CompoundObject {
  static typeName:string = 'Difference';

  constructor(children: ChildrenArray = [], operations: OperationsArray = []){
    super(children, operations);
  }

  public getTypeName():string{
    return Difference.typeName;
  }

  public clone():Difference{
    const childrenClone: Array<Object3D> = this.children.map( child => child.clone());
    return new Difference(childrenClone,this.operations);
  }
}
