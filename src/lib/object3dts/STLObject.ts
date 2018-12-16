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
 * Last modified  : 2018-11-16 17:37:42
 */

import ObjectsCommon, { OperationsArray, IViewOptions } from "./ObjectsCommon";
import Object3D from "./Object3D";
import isEqual from "lodash.isequal";
import * as THREE from "three";

import Scene from "./Scene";

interface ISTLParams {
  geometry: THREE.Geometry;
}

export default class STLObject extends Object3D {
  public static typeName: string = "STLObject";

  private parameters: ISTLParams;

  constructor(
    parameters: ISTLParams,
    operations: OperationsArray = [],
    viewOptions: IViewOptions = ObjectsCommon.createViewOptions(),
    scene: Scene
  ) {
    super(viewOptions, operations, scene);
    this.parameters = { ...parameters };
    this._meshUpdateRequired = true;
  }

  protected setParameters(parameters: ISTLParams): void {
    if (!isEqual(parameters, this.parameters)) {
      this.parameters = { ...parameters };
      this._meshUpdateRequired = true;
    }
  }

  protected getBufferGeometry(): THREE.BufferGeometry {
    return new THREE.BufferGeometry().fromGeometry(this.getGeometry());
  }

  protected getGeometry(): THREE.Geometry {
    const { geometry } = this.parameters;
    return geometry;
  }
}
