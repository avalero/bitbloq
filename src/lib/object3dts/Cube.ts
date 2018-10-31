/**
 * Copyright (c) 2018 Bitbloq (BQ)
 *
 * License: MIT
 *
 * long description for the file
 *
 * @summary short description for the file
 * @author David García <https://github.com/empoalp>, 
 * @author Alberto Valero <https://github.com/avalero>
 *
 * Created at     : 2018-10-02 19:16:51 
<<<<<<< HEAD
 * Last modified  : 2018-10-18 17:57:28
=======
 * Last modified  : 2018-10-30 12:34:21
>>>>>>> 06cc51177c872f5244d1505be9c78319250562f9
 */

import * as THREE from 'three';
import {OperationsArray, Object3D} from './Object3D';
import isEqual from'lodash.isequal';

interface ICubeParams {
  width:number,
  depth:number,
  height:number
}

export default class Cylinder extends Object3D{

  public static typeName:string = 'Cube';
  private parameters: ICubeParams;

  constructor(parameters: ICubeParams, operations: OperationsArray = []){
    super(operations);
    this.parameters = {...parameters};
    this._updateRequired = true;
    this.mesh = this.getPrimitiveMesh();
    
  }

  public setParameters(parameters: ICubeParams): void{
    if(!isEqual(parameters,this.parameters)){
      this.parameters = Object.assign({},parameters);
      this._updateRequired = true;
    }
  }

  protected getGeometry(): THREE.Geometry {
    const {width, height, depth} = this.parameters;
    this._updateRequired = false;
    return new THREE.BoxGeometry(Number(width), Number(depth), Number(height));
  }

  protected getBufferGeometry(): THREE.BufferGeometry {
    const {width, height, depth} = this.parameters;
    this._updateRequired = false;
    return new THREE.BoxBufferGeometry(Number(width), Number(depth), Number(height));
  }
}
