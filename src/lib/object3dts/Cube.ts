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
 * Last modified  : 2018-11-08 11:12:22
 */

import * as THREE from 'three';
import ObjectsCommon, {OperationsArray, IViewOptions} from './ObjectsCommon';
import Object3D from './Object3D';
import isEqual from'lodash.isequal';

interface ICubeParams {
  width:number,
  depth:number,
  height:number
}

export default class Cube extends Object3D{

  public static typeName:string = 'Cube';
  private parameters: ICubeParams;

  constructor(
    parameters: ICubeParams,  
    operations: OperationsArray = [], 
    viewOptions: IViewOptions = ObjectsCommon.createViewOptions()
    ){
    super(viewOptions,operations);
    this.parameters = {...parameters};
    this._updateRequired = true;
  }

  public setParameters(parameters: ICubeParams): void{
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
    return new Cube(this.parameters, this.operations, this.viewOptions);  }
}
