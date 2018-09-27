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
 * Created at     : 2018-09-27 16:30:48 
 * Last modified  : 2018-09-27 17:50:42
 */



import * as BABYLON from 'babylonjs'
import uuid from 'uuid'

export interface IParameterType{
  name:string,
  label:string,
  type:string,
  defaultValue:number
}

interface ICommonGeometryParamas{
  color?:string;
  name?:string;
}

export interface ICubeParams extends ICommonGeometryParamas{
  width:number,
  depth:number,
  height:number
}

export interface ISphereParams extends ICommonGeometryParamas{
  radius:number
}

export interface ICylinderParams extends ICommonGeometryParamas{
  radius1:number,
  radius2:number,
  height:number
}

interface ITranslateOperation{
  type:string,
  x:number,
  y:number,
  z:number,
  relative:boolean
}

interface IRotateOperation{
  type:string,
  axis:string,
  angle:number,
  relative:boolean
}

interface IScaleOperation{
  type:string,
  x:number,
  y:number,
  z:number
}

export interface IObject3DJson{
  name:string, 
  parameters: (ICubeParams|ISphereParams|ICylinderParams), 
  operations: Array< (ITranslateOperation|IRotateOperation|IScaleOperation )>, 
  id: string,
  type: string
}

export class Object3D{

  public static typeName:string ="";
  public static parameterTypes: IParameterType[] = [];

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

  public static createFromJSON(json: IObject3DJson): Object3D {
    const {name, parameters, operations, id} = json;
    return new this(name, parameters, operations, id);
  }

  public id = '';
  public name = '';
  public parameters:(ICubeParams|ISphereParams|ICylinderParams|any) = {};
  public operations:Array<ITranslateOperation|IRotateOperation|IScaleOperation> = [];
  
  constructor(name: string, parameters: (ICubeParams|ISphereParams|ICylinderParams), operations:Array<ITranslateOperation|IRotateOperation|IScaleOperation> = [], id?:string){
    const defaultParams: (ICubeParams|ISphereParams|ICylinderParams|any) = {};


    (this.constructor as typeof Object3D).parameterTypes.forEach(paramType => {
        defaultParams[paramType.name!] = paramType.defaultValue;
      });

    // select random color
    const colorI: number = Math.floor(Math.random() * Object3D.colors.length);
    
    this.parameters = {
      ...defaultParams,
      color: Object3D.colors[colorI],
      ...parameters
    };

    this.operations = operations;
    this.id = id || uuid();
    this.name = name;
  }

  public addOperation(operation) {
    this.operations.push(operation);
  }

  public applyOperations(mesh){
    if(this.operations){
      this.operations.forEach( operation => 
        {
          // Translate operation
          if(operation.type === Object3D.createTranslateOperation().type){
            if((operation as ITranslateOperation).relative){
              mesh.locallyTranslate(
                new BABYLON.Vector3(
                  Number((operation as ITranslateOperation).x),
                  Number((operation as ITranslateOperation).y),
                  Number((operation as ITranslateOperation).z)
                )
              );
            }else{
              // absolute x,y,z axis.
              mesh.position.x += Number((operation as ITranslateOperation).x);
              mesh.position.y += Number((operation as ITranslateOperation).y);
              mesh.position.z += Number((operation as ITranslateOperation).z);
            }
            // Rotation Operation
          }else if(operation.type === Object3D.createRotateOperation().type){
            const angle = Math.PI / 180 * (Number((operation as IRotateOperation).angle));
            switch((operation as IRotateOperation).axis){
              case 'x':
                if((operation as IRotateOperation).relative){
                  
                  mesh.addRotation(angle,0,0);
                }else{
                  mesh.rotate.x +=  angle;
                }
                break;
                
              case 'y':
                if((operation as IRotateOperation).relative){
                  mesh.addRotation(0,angle,0);
                }else{
                  mesh.rotate.y +=  angle;
                }
                break;

              case 'z':
                if((operation as IRotateOperation).relative){
                  mesh.addRotation(0, 0, angle);
                }else{
                  mesh.rotate.z +=  angle;
                }
                break;
              
              default:
                throw new Error('Unexpected Rotation Axis');
            }
          }else if(operation.type === Object3D.createScaleOperation().type){
            if(Number((operation as IScaleOperation).x)>0 && Number((operation as IScaleOperation).y)> 0 && Number((operation as IScaleOperation).z) >0)
            {
              mesh.scaling = new BABYLON.Vector3(
                mesh.scale.x * Number((operation as IScaleOperation).x), 
                mesh.scale.y * Number((operation as IScaleOperation).y), 
                mesh.scale.z * Number((operation as IScaleOperation).z)
              );
            }
          }
        });
    }  }

  public getMesh(scene: BABYLON.Scene): BABYLON.Mesh {
    const mesh: BABYLON.Mesh = this.getGeometry(scene);
    
    const material = new BABYLON.StandardMaterial("material", scene);
    material.ambientColor = BABYLON.Color3.FromHexString(this.parameters.color || '#ff0000');

    this.applyOperations(mesh);

    mesh.material = material;

    return mesh;
  }

  public getGeometry(scene: BABYLON.Scene): BABYLON.Mesh {
    throw new Error('Method not implemented');
  }

  public toJSON():IObject3DJson {
    let type:string ="";
    type = (this.constructor as typeof Object3D).typeName;
  
    const {id, name, parameters, operations, constructor} = this;
    return {
      id,
      name,
      type,
      parameters,
      operations,
    };
  }
}
