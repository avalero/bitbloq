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
 * Last modified  : 2018-10-02 20:24:16
 */

import * as BABYLON from 'babylonjs';
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

  constructor(scene: BABYLON.Scene, parameters: ICubeParams, operations: OperationsArray = []){
    super(operations, scene);
    this.parameters = {
      color: this.color,
      ...parameters
    };
    this.color = this.parameters.color;
    this.mesh = super.addMeshToScene(scene);
  }

  protected getGeometry(): BABYLON.Mesh {
    const {width, height, depth} = this.parameters;
    const name:string = this.parameters.name || 'myCube';
    return BABYLON.MeshBuilder.CreateBox(name, {height: Number(height), width: Number(width), depth: Number(depth)}, this.scene);
  }
}