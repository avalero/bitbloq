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
 * Last modified  : 2018-11-09 13:12:32
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

  public clone():Union{
    return new Union(this.children, this.operations);
  }
}
