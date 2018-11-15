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
 * Created at     : 2018-10-16 12:59:30 
 * Last modified  : 2018-11-15 18:56:32
 */



import * as THREE from 'three';
import ObjectsCommon, {OperationsArray, IViewOptions} from './ObjectsCommon';
import Object3D from './Object3D';
import isEqual from 'lodash.isequal';

interface ISphereParams {
  radius:number
}

export interface ISphereJSON {
  id: string;
  type: string;
  parameters: ISphereParams;
  viewOptions: IViewOptions;
  operations: OperationsArray;
}

export default class Sphere extends Object3D{

  public static typeName:string = 'Sphere';
  private parameters: ISphereParams;

  constructor(
    parameters: ISphereParams,
    operations: OperationsArray = [], 
    viewOptions: IViewOptions = ObjectsCommon.createViewOptions()
    ){
    super(viewOptions,operations);
    this.parameters = {...parameters};
    this._updateRequired = true;    
  }

  public static newFromJSON(json: string):Sphere {
    const object: ISphereJSON = JSON.parse(json);
    return new Sphere(object.parameters, object.operations, object.viewOptions);
}

  public setParameters(parameters: ISphereParams): void{
    if(!isEqual(parameters,this.parameters)){
      this.parameters = {...parameters};
      this._updateRequired = true;
    }
  }

  protected getGeometry(): THREE.Geometry {
    const {radius} = this.parameters;
    this._updateRequired = false;
    return new THREE.SphereGeometry(
      Number(radius),
      Math.max(16,Math.min(Number(radius)*24/5 , 32)), 
      Math.max(16,Math.min(Number(radius)*24/5, 32))
      );
  }

  protected getBufferGeometry(): THREE.BufferGeometry {
    const {radius} = this.parameters;
    this._updateRequired = false;
    return new THREE.SphereBufferGeometry(
      Number(radius),
      Math.max(16,Math.min(Number(radius)*24/5 , 32)), 
      Math.max(16,Math.min(Number(radius)*24/5, 32)));
  }

  public clone():Sphere{
    return Sphere.newFromJSON(this.toJSON());
  }

  
  public toJSON():string{
    const object: ISphereJSON = {
      id: this.id,
      type: Sphere.typeName,
      parameters: this.parameters,
      viewOptions: this.viewOptions,
      operations: this.operations,
    }
    return JSON.stringify(object);
  }

  public updateFromJSON(json: string){
    const object: ISphereJSON = JSON.parse(json);
    if(this.id === object.id){
      this.setParameters(object.parameters);
      this.setOperations(object.operations);
      this.setViewOptions(object.viewOptions);
    }else{
      throw new Error('Object id does not match with JSON id');
    }
  }
}
