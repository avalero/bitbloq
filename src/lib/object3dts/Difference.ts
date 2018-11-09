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
 * Last modified  : 2018-11-09 13:10:34
 */



import CompoundObject from './CompoundObject';
import {ChildrenArray, OperationsArray} from './Object3D'

export default class Difference extends CompoundObject {
  static typeName:string = 'Difference';

  constructor(children: ChildrenArray = [], operations: OperationsArray = []){
    super(children, operations);
  }

  public getTypeName():string{
    return Difference.typeName;
  }

  public clone():Difference{
    return new Difference(this.children,this.operations);
  }
}
