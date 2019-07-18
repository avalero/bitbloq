/*
 * File: Sphere.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Bitbloq Repository: https://github.com/bitbloq
 * Bitbloq Team: https://github.com/orgs/Bitbloq/people
 * Copyright 2018 - 2019 BQ Educacion.
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
    mesh?: THREE.Mesh | undefined,
    bspNodeBuffer?: ArrayBuffer
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

    if (bspNodeBuffer) {
      this.bspNodeBuffer = bspNodeBuffer;
    } else {
      this.bspPromise = this.computeBSPAsync();
    }
  }

  public clone(): Sphere {
    if (this.mesh && !(this.meshUpdateRequired || this.pendingOperation)) {
      const objSphere = new Sphere(
        this.parameters as ISphereParams,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone(),
        this.bspNodeBuffer.slice(0)
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
