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
 * Created at     : 2018-10-16 12:59:38 
 * Last modified  : 2018-11-08 11:15:51
 */

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
 * Last modified  : 2018-10-16 12:51:01
 */

import * as THREE from 'three';
import {OperationsArray} from './Object3D';
import Object3D from './Object3D';
import isEqual from 'lodash.isequal'

interface IPrismParams{
  sides:number,
  length:number,
  height:number
}

export default class Prism extends Object3D{

  public static typeName:string = 'Prism';

  private parameters: IPrismParams;
  
  constructor(parameters: IPrismParams, operations: OperationsArray = []){
    super(operations);
    this.parameters = {...parameters};
    this._updateRequired = true;
    this.mesh = this.getPrimitiveMesh();    
  }

  protected setParameters(parameters: IPrismParams): void{
    if(!isEqual(parameters,this.parameters)){
      this.parameters = {...parameters};
      this._updateRequired = true;
    }
  }

  protected getGeometry(): THREE.Geometry {
    const {sides,length,height} = this.parameters;
    this._updateRequired = false;
    const radius:number =  length/(2*Math.sin(Math.PI/sides));
    return new THREE.CylinderGeometry(Number(radius), Number(radius), Number(height), Number(sides)).rotateX(Math.PI/2);
  }

  protected getBufferGeometry(): THREE.BufferGeometry {
    const {sides,length,height} = this.parameters;
    this._updateRequired = false;
    const radius:number =  length/(2*Math.sin(Math.PI/sides));
    return new THREE.CylinderBufferGeometry(Number(radius), Number(radius), Number(height), Number(sides)).rotateX(Math.PI/2);
  }

  public clone():Prism{
    return new Prism(this.parameters, this.operations);
  }


}
