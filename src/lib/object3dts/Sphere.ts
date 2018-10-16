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
 * Created at     : 2018-10-16 12:59:30 
 * Last modified  : 2018-10-16 15:06:45
 */





import * as THREE from 'three';
import {OperationsArray, Object3D} from './Object3D';
import isEqual from 'lodash.isequal';

interface ISphereParams {
  radius:number
}

export default class Sphere extends Object3D{

  public static typeName:string = 'Sphere';
  private parameters: ISphereParams;

  constructor(parameters: ISphereParams, operations: OperationsArray = []){
    super(operations);
    this.parameters = {...parameters};
    this._updateRequired = true;
    this.mesh = this.getMesh();
    
  }

  protected setParameters(parameters: ISphereParams): void{
    if(!isEqual(parameters,this.parameters)){
      this.parameters = {...parameters};
      this._updateRequired = true;
    }
  }

  protected getGeometry(): THREE.Geometry {
    const {radius} = this.parameters;
    this._updateRequired = false;
    return new THREE.SphereGeometry(Number(radius),24,24);
  }
}
