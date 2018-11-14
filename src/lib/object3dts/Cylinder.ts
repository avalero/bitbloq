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
 * Last modified  : 2018-11-14 08:45:17
 */

import * as THREE from 'three';
import {OperationsArray} from './Object3D';
import Object3D from './Object3D';
import isEqual from 'lodash.isequal'

interface ICylinderParams{
  r0:number,
  r1:number,
  height:number
}

export default class Cylinder extends Object3D{

  public static typeName:string = 'Cylinder';

  private parameters: ICylinderParams;
  
  constructor(parameters: ICylinderParams, operations: OperationsArray = []){
    super(operations);
    this.parameters = {...parameters};
    this._updateRequired = true;
    this.mesh = this.getPrimitiveMesh();    
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
    return new Cylinder(this.parameters, this.operations);
  }


}
