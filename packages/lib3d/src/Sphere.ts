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
 * Last modified  : 2019-01-31 10:03:38
 */

import * as THREE from 'three';

import ObjectsCommon from './ObjectsCommon';
import PrimitiveObject from './PrimitiveObject';

import {
  ISphereJSON,
  ISphereParams,
  IViewOptions,
  OperationsArray,
} from './Interfaces';

export default class Sphere extends PrimitiveObject {
  public static typeName: string = 'Sphere';

  public static newFromJSON(object: ISphereJSON): Sphere {
    if (object.type !== Sphere.typeName) {
      throw new Error('Not Sphere Object');
    }

    let sphere: Sphere;
    let mesh: THREE.Mesh;
    if (object.mesh) {
      mesh = new THREE.ObjectLoader().parse(object.mesh);
      sphere = new Sphere(
        object.parameters,
        object.operations,
        object.viewOptions,
        mesh
      );
    } else {
      sphere = new Sphere(
        object.parameters,
        object.operations,
        object.viewOptions
      );
    }
    sphere.id = object.id || sphere.id;
    return sphere;
  }

  constructor(
    parameters: ISphereParams,
    operations: OperationsArray = [],
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    mesh?: THREE.Mesh | undefined
  ) {
    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...viewOptions,
    };
    super(vO, operations);
    this.type = Sphere.typeName;
    this.setParameters(parameters);

    if (mesh) {
      this.setMesh(mesh);
    } else {
      this.computeMesh();
      this.meshPromise = null;
    }
  }

  public clone(): Sphere {
    if (this.mesh && !(this.meshUpdateRequired || this.pendingOperation)) {
      const objSphere = new Sphere(
        this.parameters as ISphereParams,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone()
      );
      return objSphere;
    }
    const obj = new Sphere(
      this.parameters as ISphereParams,
      this.operations,
      this.viewOptions
    );
    return obj;
  }

  protected getGeometry(): THREE.Geometry {
    let { radius } = this.parameters as ISphereParams;
    radius = Math.max(0, radius);
    // this._meshUpdateRequired = false;
    return new THREE.SphereGeometry(
      Number(radius),
      Math.max(12, Math.min(Number(radius) * 5, 16)),
      Math.max(12, Math.min(Number(radius) * 5, 16))
    );
  }
}
