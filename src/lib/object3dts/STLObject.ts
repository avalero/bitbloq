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
 * Created at     : 2018-10-16 12:59:08 
 * Last modified  : 2018-10-16 15:05:32
 */

import {OperationsArray, Object3D} from './Object3D';
import isEqual from 'lodash.isequal';

interface ISTLParams{
  geometry:THREE.Geometry
}

export default class STLObject extends Object3D {

  public static typeName: string = 'STLObject';

  private parameters: ISTLParams;

  constructor(parameters: ISTLParams, operations: OperationsArray = []){
    super(operations);
    this.parameters = {...parameters};
    this._updateRequired = true;
    this.mesh = this.getMesh();
  }

  protected setParameters(parameters: ISTLParams): void{
    if(!isEqual(parameters,this.parameters)){
      this.parameters = {...parameters};
      this._updateRequired = true;
    }
  }

  getGeometry() {
    const {geometry} = this.parameters;
    return geometry;
  }
}
