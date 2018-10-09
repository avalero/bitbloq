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
 * Last modified  : 2018-10-08 21:38:57
 */

import * as THREE from 'three';
import {ICommonGeometryParamas, IParameterType, OperationsArray, Object3D} from './Object3D.ts';

interface ICylinderParams extends ICommonGeometryParamas{
  r0:number,
  r1:number,
  height:number
}

export default class Cylinder extends Object3D{

  public static typeName:string = 'Cylinder';

  public static parameterTypes: IParameterType[] = [
    {
      name: 'r0',
      label: 'Bottom Radius',
      type: 'integer',
      defaultValue: 5,
    },
    {
      name: 'r1',
      label: 'Top Radius',
      type: 'integer',
      defaultValue: 5,
    },
    {
      name: 'height',
      label: 'Height',
      type: 'integer',
      defaultValue: 10,
    },
  ]

  private parameters: ICylinderParams;
  
  constructor(parameters: ICylinderParams, operations: OperationsArray = []){
    super(operations);
    this.parameters = {
      color: this.color,
      ...parameters
    };
    this.color = this.parameters.color;
    this.updateRequired = true;
    this.mesh = this.getMesh();    
  }

  protected setParameters(parameters: ICylinderParams): void{
    if(parameters !== this.parameters){
      this.updateRequired = true;
      this.parameters = {...parameters};
    }
  }

  protected getGeometry(): THREE.Geometry {
    const {r0,r1,height} = this.parameters;
    this.updateRequired = false;
    return new THREE.CylinderGeometry(Number(r1), Number(r0), Number(height), 32, 1).rotateX(Math.PI/2);
  }


}