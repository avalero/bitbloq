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
 * Last modified  : 2018-11-14 08:47:14
 */



import CompoundObject, { ICompountObjectJSON} from './CompoundObject';
import Object3D, {ChildrenArray} from './Object3D'
import {OperationsArray} from './ObjectsCommon'

export default class Union extends CompoundObject {
  static typeName:string = 'Union';


  public static newFromJSON(json: string): Union{
    const children:ChildrenArray = [];
    const object:ICompountObjectJSON = JSON.parse(json);
    if(object.type != Union.typeName) throw new Error('Not Union Object');
    object.children.forEach(element => {
      children.push(ObjectFactory.newFromJSON(element));
    });
  } 

  constructor(children: ChildrenArray = [], operations: OperationsArray = []){
    super(children, operations);
    this.type = Union.typeName;
    console.log(this.toJSON());
  }


  public getTypeName():string{
    return Union.typeName;
  }

  public clone():Union{
    const childrenClone: Array<Object3D> = this.children.map( child => child.clone());
    return new Union(childrenClone, this.operations);
  }
}
