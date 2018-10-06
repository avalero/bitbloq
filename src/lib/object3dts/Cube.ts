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
 * Last modified  : 2018-10-06 21:50:34
 */

import * as THREE from 'three';
import {ICommonGeometryParamas, IParameterType, OperationsArray, Object3D} from './Object3D.ts';

interface ICubeParams extends ICommonGeometryParamas{
  width:number,
  depth:number,
  height:number
}

export default class Cube extends Object3D{

  public static typeName:string = 'Cube';

  public static parameterTypes: IParameterType[] = [
    {
      name: 'width',
      label: 'Width',
      type: 'integer',
      defaultValue: 10,
    },
    {
      name: 'height',
      label: 'Height',
      type: 'integer',
      defaultValue: 10,
    },
    {
      name: 'depth',
      label: 'Depth',
      type: 'integer',
      defaultValue: 10,
    },
  ];

  private parameters: ICubeParams;
  private formerParameters: ICubeParams;
  private _updateRequired: boolean;

  constructor(parameters: ICubeParams, operations: OperationsArray = []){
    super(operations);
    this.parameters = {
      color: this.color,
      ...parameters
    };
    this.formerParameters = {...this.parameters};
    this.color = this.parameters.color;
    this._updateRequired = true;
    
    this.mesh = super.getMesh();
    
  }

  protected setParameters(parameters: ICubeParams): void{
    this.formerParameters = {...this.parameters};
    this.parameters = {...parameters};
    if (this.parameters !== this.formerParameters){
      this._updateRequired = true;
    }
  }

  protected getGeometry(): THREE.Geometry {
    const {width, height, depth} = this.parameters;
    const name:string = this.parameters.name || 'myCube';
    this._updateRequired = false;
    return new THREE.BoxGeometry(Number(width), Number(depth), Number(height));
  }

  public get updateRequired():boolean{
    return this._updateRequired;
  }

  public set updateRequired(b: boolean){
    this._updateRequired = b;
  } 
}