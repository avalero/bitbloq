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
 * Last modified  : 2018-10-08 21:26:21
 */

import * as THREE from 'three';
import {OperationsArray, Object3D} from './Object3D.ts';

interface ICubeParams {
  width:number,
  depth:number,
  height:number
}

export default class Cube extends Object3D{

  public static typeName:string = 'Cube';

  private parameters: ICubeParams;

  constructor(parameters: ICubeParams, operations: OperationsArray = []){
    super(operations);
    this.parameters = {...parameters};
    this.updateRequired = true;
    this.mesh = this.getMesh();
    
  }

  protected setParameters(parameters: ICubeParams): void{
    if(parameters !== this.parameters){
      this.updateRequired = true;
      this.parameters = {...parameters};
    }
  }

  protected getGeometry(): THREE.Geometry {
    const {width, height, depth} = this.parameters;
    this.updateRequired = false;
    return new THREE.BoxGeometry(Number(width), Number(depth), Number(height));
  }
}
