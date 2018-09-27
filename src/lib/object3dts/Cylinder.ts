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
 * Last modified  : 2018-09-27 17:56:36
 */




// https://babylonjsguide.github.io/basics/Shapes#cylinder-or-cone

import * as BABYLON from 'babylonjs';
import {ICylinderParams, IParameterType, Object3D} from './Object3D.ts';


export default class Cylinder extends Object3D {

  public static typeName:string = 'Cylinder';

  public static parameterTypes: IParameterType[] = [
    {
      name: 'bottom_radius',
      label: 'Bottom Radius',
      type: 'integer',
      defaultValue: 5,
    },
    {
      name: 'top_radius',
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
  ];

  private getGeometry(scene: BABYLON.Scene): BABYLON.Mesh{
    const {top_radius, bottom_radius, height} = this.parameters as ICylinderParams;
    const name:string = this.parameters.name || 'myCylinder';
    const tessellation:number = Math.min(32, Math.max(16,bottom_radius/2, top_radius/2));
    const geometry:BABYLON.Mesh = BABYLON.MeshBuilder.CreateCylinder(name, 
      {
        diameterTop: Number(2*top_radius),
        diameterBottom: Number(2*bottom_radius),
        tessellation,
        height,
      }, 
      scene);
    
    return geometry;
  }
}
