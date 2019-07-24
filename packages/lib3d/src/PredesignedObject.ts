/*
 * File: PredesignedObject.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Bitbloq Repository: https://github.com/bitbloq
 * Bitbloq Team: https://github.com/orgs/Bitbloq/people
 * Copyright 2018 - 2019 BQ Educacion.
 */

import * as THREE from 'three';
import STLObject from './STLObject';
import {
  ISTLParams,
  OperationsArray,
  IViewOptions,
  ISTLJSON,
} from './Interfaces';
import ObjectsCommon from './ObjectsCommon';

export default class PredesignedObject extends STLObject {
  public static typeName: string = 'PredesignedObject';

  public static newFromJSON(object: ISTLJSON): PredesignedObject {
    if (object.type !== PredesignedObject.typeName) {
      throw new Error('Not Predesigned Object');
    }

    let stl: PredesignedObject;
    let mesh: THREE.Mesh;
    if (object.mesh) {
      mesh = new THREE.ObjectLoader().parse(object.mesh);
      stl = new PredesignedObject(
        object.parameters,
        object.operations,
        object.viewOptions,
        mesh
      );
    } else {
      stl = new PredesignedObject(
        object.parameters,
        object.operations,
        object.viewOptions
      );
    }

    stl.id = object.id || stl.id;

    return stl;
  }

  constructor(
    parameters: Partial<ISTLParams>,
    operations: OperationsArray = [],
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    mesh?: THREE.Mesh | undefined,
    bspNodeBuffer?: ArrayBuffer
  ) {
    super(parameters, operations, viewOptions, mesh, bspNodeBuffer);
    this.type = PredesignedObject.typeName;
  }

  public clone(): PredesignedObject {
    if (this.mesh && !(this.meshUpdateRequired || this.pendingOperation)) {
      const objSTL = new PredesignedObject(
        this.parameters as ISTLParams,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone(),
        this.bspNodeBuffer.slice(0)
      );
      return objSTL;
    }

    const obj = new PredesignedObject(
      this.parameters as ISTLParams,
      this.operations,
      this.viewOptions
    );
    return obj;
  }
}
