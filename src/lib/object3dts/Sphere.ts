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
 * Last modified  : 2018-11-16 17:32:13
 */

import * as THREE from 'three';
import ObjectsCommon, {
  OperationsArray,
  IViewOptions,
  IObjectsCommonJSON,
} from './ObjectsCommon';
import PrimitiveObject from './PrimitiveObject';

import Scene from './Scene';

interface ISphereParams {
  radius: number;
}

export interface ISphereJSON extends IObjectsCommonJSON {
  parameters: ISphereParams;
}

export default class Sphere extends PrimitiveObject {
  public static typeName: string = 'Sphere';

  public static newFromJSON(object: ISphereJSON, scene: Scene): Sphere {
    if (object.type != Sphere.typeName) throw new Error('Not Sphere Object');
    return new Sphere(
      object.parameters,
      object.operations,
      object.viewOptions,
      scene,
    );
  }

  constructor(
    parameters: ISphereParams,
    operations: OperationsArray = [],
    viewOptions: IViewOptions = ObjectsCommon.createViewOptions(),
    scene: Scene,
  ) {
    super(viewOptions, operations, scene);
    this.type = Sphere.typeName;
    this.parameters = { ...parameters };
    this._meshUpdateRequired = true;
  }

  protected getGeometry(): THREE.Geometry {
    let { radius } = this.parameters as ISphereParams;
    radius = Math.max(1, radius);
    this._meshUpdateRequired = false;
    return new THREE.SphereGeometry(
      Number(radius),
      Math.max(16, Math.min((Number(radius) * 24) / 5, 32)),
      Math.max(16, Math.min((Number(radius) * 24) / 5, 32)),
    );
  }

  protected getBufferGeometry(): THREE.BufferGeometry {
    let { radius } = this.parameters as ISphereParams;
    radius = Math.max(1, radius);
    this._meshUpdateRequired = false;
    return new THREE.SphereBufferGeometry(
      Number(radius),
      Math.max(16, Math.min((Number(radius) * 24) / 5, 32)),
      Math.max(16, Math.min((Number(radius) * 24) / 5, 32)),
    );
  }

  public clone(): Sphere {
    const obj = new Sphere(
      this.parameters as ISphereParams,
      this.operations,
      this.viewOptions,
      this.scene,
    );
    if (!this.meshUpdateRequired && !this.pendingOperation) {
      obj.setMesh(this.mesh.clone());
    }
    return obj;
  }
}
