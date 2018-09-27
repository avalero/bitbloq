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
 * Created at     : 2018-09-27 17:46:09 
 * Last modified  : 2018-09-27 17:46:25
 */




// https://babylonjsguide.github.io/basics/Shapes#sphere

import * as BABYLON from 'babylonjs';
import {ISphereParams, IParameterType, Object3D} from './Object3D.ts';


export default class Sphere extends Object3D {

  public static typeName:string = 'Sphere';

  public static parameterTypes: IParameterType[] = [
    {
      name: 'radius',
      label: 'Radius',
      type: 'integer',
      defaultValue: 5,
    },
  ];

  private getGeometry(scene: BABYLON.Scene): BABYLON.Mesh{
    const {radius} = this.parameters as ISphereParams;
    const name:string = this.parameters.name || 'mySphere';
    const geometry:BABYLON.Mesh = BABYLON.MeshBuilder.CreateSphere(name, {diameter: Number(radius*2), segments:16}, scene);
    return geometry;
  }
}
