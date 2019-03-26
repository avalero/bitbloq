/*
 * File: PredesignedObject.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Copyright 2018 - 2019 BQ Educacion.
 * -----
 * File Created: Tuesday, 26th February 2019
 * Last Modified:: Friday, 1st March 2019 3:49:36 pm
 * -----
 * Author: David García (david.garciaparedes@bq.com)
 * Author: Alda Martín (alda.marting@bq.com)
 * Author: Alberto Valero (alberto.valero@bq.com)
 * -----
 */

import * as THREE from "three";
import STLObject from "./STLObject";
import {
  ISTLParams,
  OperationsArray,
  IViewOptions,
  ISTLJSON
} from "./Interfaces";
import ObjectsCommon from "./ObjectsCommon";

export default class PredesignedObject extends STLObject {
  public static typeName: string = "PredesignedObject";

  public static newFromJSON(object: ISTLJSON): PredesignedObject {
    if (object.type !== PredesignedObject.typeName) {
      throw new Error("Not Predesigned Object");
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
    mesh?: THREE.Mesh | undefined
  ) {
    super(parameters, operations, viewOptions, mesh);
    this.type = PredesignedObject.typeName;
  }

  public clone(): PredesignedObject {
    if (this.mesh && !(this.meshUpdateRequired || this.pendingOperation)) {
      const objSTL = new PredesignedObject(
        this.parameters as ISTLParams,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone()
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
