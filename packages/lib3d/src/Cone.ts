/*
 * File: Cone.ts
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
  IConeJSON,
  IConeParams,
} from './Interfaces';

export default class Cone extends PrimitiveObject {
  public static typeName: string = 'Cone';

  public static newFromJSON(object: IConeJSON): Cone {
    if (object.type !== Cone.typeName) {
      throw new Error('Not Cone Object');
    }
    let cone: Cone;
    let mesh: THREE.Mesh;
    if (object.mesh) {
      mesh = new THREE.ObjectLoader().parse(object.mesh);
      cone = new Cone(
        object.parameters,
        object.operations,
        object.viewOptions,
        mesh
      );
    } else {
      cone = new Cone(object.parameters, object.operations, object.viewOptions);
    }

    cone.id = object.id || cone.id;
    return cone;
  }

  constructor(
    parameters: IConeParams,
    operations: OperationsArray = [],
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    mesh?: THREE.Mesh | undefined
  ) {
    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...viewOptions,
    };
    super(vO, operations);
    this.type = Cone.typeName;
    this.setParameters(parameters);

    if (mesh) {
      this.setMesh(mesh);
    } else {
      this.computeMesh();
      this.meshPromise = null;
    }
  }

  public clone(): Cone {
    if (this.mesh && !(this.meshUpdateRequired || this.pendingOperation)) {
      const objCyl = new Cone(
        this.parameters as IConeParams,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone()
      );
      return objCyl;
    }
    const obj = new Cone(
      this.parameters as IConeParams,
      this.operations,
      this.viewOptions
    );
    return obj;
  }

  protected getGeometry(): THREE.Geometry {
    let { r0, height } = this.parameters as IConeParams;
    r0 = Math.max(0, r0);
    height = Math.max(0, height);
    // this._meshUpdateRequired = false;
    return new THREE.ConeGeometry(Number(r0), Number(height), 18).rotateX(
      Math.PI / 2
    );
  }
}
