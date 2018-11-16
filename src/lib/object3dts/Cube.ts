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
 * Last modified  : 2018-11-15 20:24:11
 */

import * as THREE from 'three';
import ObjectsCommon, {OperationsArray, IViewOptions, Operation, IObjectsCommonJSON} from './ObjectsCommon';
import Object3D from './Object3D';
import isEqual from'lodash.isequal';
import ObjectFactory from './ObjectFactory';

interface ICubeParams {
  width:number;
  depth:number;
  height:number;
}

export interface ICubeJSON extends IObjectsCommonJSON {
  parameters: ICubeParams;
}

export default class Cube extends Object3D{

  public static typeName:string = 'Cube';

  public static newFromJSON(json: string):Cube {
      const object: ICubeJSON = JSON.parse(json);
      if(object.type != Cube.typeName) throw new Error('Not Cube Object');
      return new Cube(object.parameters, object.operations, object.viewOptions);
  }

  //private parameters: ICubeParams;

  constructor(
    parameters: ICubeParams,  
    operations: OperationsArray = [], 
    viewOptions: IViewOptions = ObjectsCommon.createViewOptions()
    )
  {
    super(viewOptions,operations);
    this.type = Cube.typeName;
    this.setParameters(parameters);
  }

  protected getGeometry(): THREE.Geometry {
    let {width, height, depth} = this.parameters as ICubeParams;
    width = Math.max(1,width); height = Math.max(1,height); depth = Math.max(1, depth);
    this._updateRequired = false;
    return new THREE.BoxGeometry(Number(width), Number(depth), Number(height));
  }

  protected getBufferGeometry(): THREE.BufferGeometry {
    let {width, height, depth} = this.parameters as ICubeParams;
    width = Math.max(1,width); height = Math.max(1,height); depth = Math.max(1, depth);
    this._updateRequired = false;
    return new THREE.BoxBufferGeometry(Number(width), Number(depth), Number(height));
  }

  public clone():Cube{
    return Cube.newFromJSON(this.toJSON());  
  }
}

