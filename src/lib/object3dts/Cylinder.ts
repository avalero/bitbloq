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
 * Created at     : 2018-10-02 19:16:51 
 * Last modified  : 2018-11-15 17:19:52
 */

import * as THREE from 'three';
import ObjectsCommon, {OperationsArray, IViewOptions} from './ObjectsCommon';
import Object3D from './Object3D';
import isEqual from 'lodash.isequal'

interface ICylinderParams{
  r0:number,
  r1:number,
  height:number
}

export interface ICylinderJSON {
  id: string;
  type: string;
  parameters: ICylinderParams;
  viewOptions: IViewOptions;
  operations: OperationsArray;
}

export default class Cylinder extends Object3D{

  public static typeName:string = 'Cylinder';

  public static newFromJSON(json:string):Cylinder{
    const object: ICylinderJSON = JSON.parse(json);
    return new Cylinder(object.parameters, object.operations, object.viewOptions);
  }

  private parameters: ICylinderParams;
  


  constructor(
    parameters: ICylinderParams,
    operations: OperationsArray = [], 
    viewOptions: IViewOptions = ObjectsCommon.createViewOptions()
    ){
    super(viewOptions,operations);
    this.parameters = {...parameters};
    this._updateRequired = true;   
  }

  public setParameters(parameters: ICylinderParams): void{
    if(!isEqual(parameters,this.parameters)){
      this.parameters = {...parameters};
      this._updateRequired = true;
    }
  }

  protected getGeometry(): THREE.Geometry {
    const {r0,r1,height} = this.parameters;
    this._updateRequired = false;
    return new THREE.CylinderGeometry(Number(r1), Number(r0), Number(height), 32, 1).rotateX(Math.PI/2);
  }

  protected getBufferGeometry(): THREE.BufferGeometry {
    const {r0,r1,height} = this.parameters;
    this._updateRequired = false;
    return new THREE.CylinderBufferGeometry(Number(r1), Number(r0), Number(height), 32, 1).rotateX(Math.PI/2);
  }

  public clone():Cylinder{
    return Cylinder.newFromJSON(this.toJSON());
    //return new Cube(this.parameters, this.operations, this.viewOptions);  
  }

  
  public toJSON():string{
    const object: ICylinderJSON = {
      id: this.id,
      type: Cylinder.typeName,
      parameters: this.parameters,
      viewOptions: this.viewOptions,
      operations: this.operations,
    }
    return JSON.stringify(object);
  }

  public updateFromJSON(json: string){
    const object: ICylinderJSON = JSON.parse(json);
    if(this.id === object.id){
      this.setParameters(object.parameters);
      this.setOperations(object.operations);
      this.setViewOptions(object.viewOptions);
    }else{
      throw new Error('Object id does not match with JSON id');
    }
  }


}
