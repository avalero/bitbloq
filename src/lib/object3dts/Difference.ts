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
 * Last modified  : 2018-11-16 17:46:13
 */



import CompoundObject, { ICompountObjectJSON, ChildrenArray} from './CompoundObject';
import Object3D from './Object3D'
import {OperationsArray} from './ObjectsCommon'


export default class Difference extends CompoundObject {
  static typeName:string = 'Difference';

  constructor(children: ChildrenArray = [], operations: OperationsArray = []){
    super(children, operations);
    this.type = Difference.typeName;
  }

  public clone():Difference{
    const childrenClone: Array<Object3D> = this.children.map( child => child.clone());
    return new Difference(childrenClone,this.operations);
  }
}
