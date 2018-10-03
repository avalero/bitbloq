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
 * Created at     : 2018-10-02 18:56:46 
 * Last modified  : 2018-10-03 20:11:50
 */

import * as BABYLON from 'babylonjs'
import uuid from 'uuid'
import Operation from '../../components/threed/Operation';

export interface IParameterType{
  name:string,
  label:string,
  type:string,
  defaultValue:number
}

interface ICommonOperation{
  type:string
}

interface ITranslateOperation extends ICommonOperation{
  x:number,
  y:number,
  z:number,
  relative:boolean
}

interface IRotateOperation extends ICommonOperation{
  axis:string,
  angle:number,
  relative:boolean
}

interface IScaleOperation extends ICommonOperation{
  x:number,
  y:number,
  z:number
}

export interface ICommonGeometryParamas{
  color?:string,
  name:string
}

type Operation = (ITranslateOperation|IRotateOperation|IScaleOperation);
export type OperationsArray = Array<Operation>;

export class Object3D{

  public static createTranslateOperation(x:number = 0, y:number = 0, z:number = 0, relative:boolean = true): ITranslateOperation {
    return {
      type: 'translation',
      x,
      y,
      z,
      relative
    };
  }

  public static createRotateOperation(axis:string = 'x', angle:number = 0, relative:boolean = true): IRotateOperation {
    return {
      type: 'rotation',
      axis,
      angle,
      relative
    };
  }

  public static createScaleOperation(x:number = 1, y:number = 1, z:number = 1): IScaleOperation {
    return {
      type: 'scale',
      x,
      y,
      z
    };
  }

  public static colors: string[] = [
    '#e300ff',
    '#b0ff00',
    '#00ffd2',
    '#fdff00',
    '#ff00f4',
    '#00fff8',
    '#f9fe44',
    '#7aff4f',
    '#968afc'
  ]
  
  protected mesh: BABYLON.Mesh;
  protected scene: BABYLON.Scene; 
  protected color: string;
  private operations: OperationsArray;
  private pendingOperation: boolean;

  constructor(operations: OperationsArray, scene: BABYLON.Scene){
    this.scene = scene;
    this.operations = operations;
    this.pendingOperation = true;
    const color_index:number = Math.floor(Math.random() * Object3D.colors.length);
    this.color = Object3D.colors[color_index];
  }

  public addOperation(operation: Operation): void{
    this.operations.push(operation);
    this.pendingOperation = true;
  }

  private applyOperations(){
    if(this.pendingOperation){
      this.operations.forEach( (operation) => 
      {
        // Translate operation
        if( operation.type === Object3D.createTranslateOperation().type){
          this.applyTranslateOperation(operation as ITranslateOperation);
        }
      });
    }
    this.pendingOperation = false;
  }

  protected addMeshToScene(): BABYLON.Mesh {
    this.mesh = this.getGeometry();
    this.applyOperations();
    const material:BABYLON.StandardMaterial = new BABYLON.StandardMaterial(`${this.parameters.name}material`, this.scene);
    material.emissiveColor = BABYLON.Color3.FromHexString(this.color || '#ff0000');
    this.mesh.material = material;


    return this.mesh;
  }

  protected getGeometry(): BABYLON.Mesh {
    throw new Error('ERROR. Pure Virtual Function implemented in children');
  }

  private applyTranslateOperation(operation: ITranslateOperation): void{
    if(operation.relative){
      this.mesh.locallyTranslate(
        new BABYLON.Vector3(
          Number(operation.x),
          Number(operatio.y),
          Number(operation.z)
        )
      );
    }else{
      // absolute x,y,z axis.
      this.mesh.position.x += Number(operation.x);
      this.mesh.position.y += Number(operation.y);
      this.mesh.position.z += Number(operation.z);
    }
  }
}