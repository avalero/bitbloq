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
 * Created at     : 2018-09-27 16:30:10 
 * Last modified  : 2018-09-27 16:30:35
 */





import * as BABYLON from 'babylonjs';
import {ICubeParams, IParameterType, Object3D} from './Object3D.ts';


export default class Cube extends Object3D {

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

  private getGeometry(scene: BABYLON.Scene): BABYLON.Mesh{
    const {width, height, depth} = this.parameters as ICubeParams;
    const name:string = this.parameters.name || 'myCube';
    const geometry:BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox(name, {height: Number(height), width: Number(width), depth: Number(depth)}, scene);
    return geometry;
  }
}
