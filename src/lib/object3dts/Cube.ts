/**
 * Copyright (c) 2018 Bitbloq (BQ)
 *
 * License: MIT
 *
 * long description for the file
 *
 * @summary short description for the file
 * @author David García <https://github.com/empoalp>, 
 * @author Alberto Valero <https://github.com/avalero>
 *
 * Created at     : 2018-10-02 19:16:51 
 * Last modified  : 2018-11-15 18:48:30
 */

import * as THREE from 'three';
import ObjectsCommon, {OperationsArray, IViewOptions, Operation} from './ObjectsCommon';
import Object3D from './Object3D';
import isEqual from'lodash.isequal';

interface ICubeParams {
  width:number,
  depth:number,
  height:number
}

export interface ICubeJSON {
  id: string;
  type: string;
  parameters: ICubeParams;
  viewOptions: IViewOptions;
  operations: OperationsArray;
}

export default class Cube extends Object3D{

  public static typeName:string = 'Cube';

  public static newFromJSON(json: string):Cube {
      const object: ICubeJSON = JSON.parse(json);
      return new Cube(object.parameters, object.operations, object.viewOptions);
  }

  private parameters: ICubeParams;

  constructor(
    parameters: ICubeParams,  
    operations: OperationsArray = [], 
    viewOptions: IViewOptions = ObjectsCommon.createViewOptions()
    )
  {
    super(viewOptions,operations);
    this.setParameters(parameters);
  }

  public setParameters(parameters: ICubeParams): void{
    debugger;
    if(!this.parameters ){
      this.parameters = Object.assign({},parameters);
      this._updateRequired = true;
      return;
    }

    if(!isEqual(parameters,this.parameters)){
      this.parameters = Object.assign({},parameters);
      this._updateRequired = true;
    }
  }

  protected getGeometry(): THREE.Geometry {
    const {width, height, depth} = this.parameters;
    this._updateRequired = false;
    return new THREE.BoxGeometry(Number(width), Number(depth), Number(height));
  }

  protected getBufferGeometry(): THREE.BufferGeometry {
    const {width, height, depth} = this.parameters;
    this._updateRequired = false;
    return new THREE.BoxBufferGeometry(Number(width), Number(depth), Number(height));
  }

  public clone():Cube{
    return Cube.newFromJSON(this.toJSON());
    //return new Cube(this.parameters, this.operations, this.viewOptions);  
  }

  
  public toJSON():string{
    const object: ICubeJSON = {
      id: this.id,
      type: Cube.typeName,
      parameters: this.parameters,
      viewOptions: this.viewOptions,
      operations: this.operations,
    }
    return JSON.stringify(object);
  }

  public updateFromJSON(json: string){
    const object: ICubeJSON = JSON.parse(json);
    if(this.id === object.id){
      this.setParameters(object.parameters);
      this.setOperations(object.operations);
      this.setViewOptions(object.viewOptions);
    }else{
      throw new Error('Object id does not match with JSON id');
    }
  }
}

