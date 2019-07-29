/*
 * File: TruncatedCone.ts
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
  ITruncatedConeJSON,
  ITruncatedConeParams,
} from './Interfaces';

export default class TruncatedCone extends PrimitiveObject {
  public static typeName: string = 'TruncatedCone';

  public static newFromJSON(object: ITruncatedConeJSON): TruncatedCone {
    if (object.type !== TruncatedCone.typeName) {
      throw new Error('Not TruncatedCone Object');
    }
    let truncCone: TruncatedCone;
    let mesh: THREE.Mesh;
    if (object.mesh) {
      mesh = new THREE.ObjectLoader().parse(object.mesh);
      truncCone = new TruncatedCone(
        object.parameters,
        object.operations,
        object.viewOptions,
        mesh
      );
    } else {
      truncCone = new TruncatedCone(
        object.parameters,
        object.operations,
        object.viewOptions
      );
    }

    truncCone.id = object.id || truncCone.id;
    return truncCone;
  }

  constructor(
    parameters: ITruncatedConeParams,
    operations: OperationsArray = [],
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    mesh?: THREE.Mesh | undefined
  ) {
    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...viewOptions,
    };
    super(vO, operations);
    this.type = TruncatedCone.typeName;
    this.setParameters(parameters);

    if (mesh) {
      this.setMesh(mesh);
    } else {
      this.computeMesh();
      this.meshPromise = null;
    }
  }

  public clone(): TruncatedCone {
    if (this.mesh && !(this.meshUpdateRequired || this.pendingOperation)) {
      const objCyl = new TruncatedCone(
        this.parameters as ITruncatedConeParams,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone()
      );
      return objCyl;
    }
    const obj = new TruncatedCone(
      this.parameters as ITruncatedConeParams,
      this.operations,
      this.viewOptions
    );
    return obj;
  }

  protected getGeometry(): THREE.Geometry {
    let { r0, r1, height } = this.parameters as ITruncatedConeParams;
    r0 = Math.max(0, r0);
    r1 = Math.max(0, r1);
    height = Math.max(0, height);
    // this._meshUpdateRequired = false;

    return new THREE.CylinderGeometry(
      Number(r1),
      Number(r0),
      Number(height),
      18,
      1
    ).rotateX(Math.PI / 2);
  }
}
