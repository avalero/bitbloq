/*
 * File: Torus.ts
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
  IViewOptions,
  OperationsArray,
  ITorusJSON,
  ITorusParams,
} from './Interfaces';

export default class Torus extends PrimitiveObject {
  public static typeName: string = 'Torus';

  public static newFromJSON(object: ITorusJSON): Torus {
    if (object.type !== Torus.typeName) {
      throw new Error('Not Torus Object');
    }
    let torus: Torus;
    let mesh: THREE.Mesh;
    if (object.mesh) {
      mesh = new THREE.ObjectLoader().parse(object.mesh);
      torus = new Torus(
        object.parameters,
        object.operations,
        object.viewOptions,
        mesh
      );
    } else {
      torus = new Torus(
        object.parameters,
        object.operations,
        object.viewOptions
      );
    }

    torus.id = object.id || torus.id;
    return torus;
  }

  constructor(
    parameters: ITorusParams,
    operations: OperationsArray = [],
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    mesh?: THREE.Mesh | undefined
  ) {
    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...viewOptions,
    };
    super(vO, operations);
    this.type = Torus.typeName;
    this.setParameters(parameters);

    if (mesh) {
      this.setMesh(mesh);
    } else {
      this.computeMesh();
      this.meshPromise = null;
    }
  }

  public clone(): Torus {
    if (this.mesh && !(this.meshUpdateRequired || this.pendingOperation)) {
      const objCyl = new Torus(
        this.parameters as ITorusParams,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone()
      );
      return objCyl;
    }
    const obj = new Torus(
      this.parameters as ITorusParams,
      this.operations,
      this.viewOptions
    );
    return obj;
  }

  protected getGeometry(): THREE.Geometry {
    let { r0, r1 } = this.parameters as ITorusParams;
    r0 = Math.max(0, r0);
    r1 = Math.max(0, r1);
    // this._meshUpdateRequired = false;
    return new THREE.TorusGeometry(
      Number(r0),
      Number(r1),
      Math.max(12, Math.min(Number(r1) * 5, 16)),
      Math.max(12, Math.min(Number(r0) * 5, 16))
    );
  }
}
