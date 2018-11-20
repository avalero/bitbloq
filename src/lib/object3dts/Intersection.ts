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
 * Last modified  : 2018-11-16 19:37:46
 */


import CompoundObject, { ICompountObjectJSON, ChildrenArray} from './CompoundObject';
import Object3D from './Object3D'
import {OperationsArray} from './ObjectsCommon'
import ObjectFactory from './ObjectFactory';


export default class Intersection extends CompoundObject {
  static typeName:string = 'Intersection';

  constructor(children: ChildrenArray = [], operations: OperationsArray = []){
    super(children, operations);
    this.type = Intersection.typeName;
  }

  public static newFromJSON(json: string): Intersection{
    const children:ChildrenArray = [];

    const object:ICompountObjectJSON = JSON.parse(json);
    
    if(object.type != Intersection.typeName) throw new Error('Not Intersection Object');
    
    object.children.forEach(element => {
      const json = JSON.stringify(element);
      const child = ObjectFactory.newFromJSON(json) as Object3D;
      children.push(child);
    });

    return new Intersection(children, object.operations);
  }

  public clone():Intersection{
    const childrenClone: Array<Object3D> = this.children.map( child => child.clone());
    return new Intersection(childrenClone, this.operations);
  }
}
