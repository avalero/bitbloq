/*
 * File: Octahedron.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Bitbloq Repository: https://github.com/bitbloq
 * Bitbloq Team: https://github.com/orgs/Bitbloq/people
 * Copyright 2018 - 2019 BQ Educacion.
 */

import * as THREE from "three";

import ObjectsCommon from "./ObjectsCommon";
import PrimitiveObject from "./PrimitiveObject";

import {
  IOctahedronJSON,
  IOctahedronParams,
  IViewOptions,
  OperationsArray
} from "./Interfaces";

export default class Octahedron extends PrimitiveObject {
  public static typeName = "Octahedron";

  public static newFromJSON(object: IOctahedronJSON): Octahedron {
    if (object.type !== Octahedron.typeName) {
      throw new Error("Not Octahedron Object");
    }

    let octahedron: Octahedron;
    let mesh: THREE.Mesh;
    if (object.mesh) {
      mesh = new THREE.ObjectLoader().parse(object.mesh);
      octahedron = new Octahedron(
        object.parameters,
        object.operations,
        object.viewOptions,
        mesh
      );
    } else {
      octahedron = new Octahedron(
        object.parameters,
        object.operations,
        object.viewOptions
      );
    }
    octahedron.id = object.id || octahedron.id;
    return octahedron;
  }

  constructor(
    parameters: IOctahedronParams,
    operations: OperationsArray = [],
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    mesh?: THREE.Mesh | undefined
  ) {
    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...viewOptions
    };
    super(vO, operations);
    this.type = Octahedron.typeName;
    this.setParameters(parameters);

    if (mesh) {
      this.setMesh(mesh);
    } else {
      this.computeMesh();
      this.meshPromise = null;
    }
  }

  public clone(): Octahedron {
    if (this.mesh && !(this.meshUpdateRequired || this.pendingOperation)) {
      const objOctahedron = new Octahedron(
        this.parameters as IOctahedronParams,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone()
      );
      return objOctahedron;
    }
    const obj = new Octahedron(
      this.parameters as IOctahedronParams,
      this.operations,
      this.viewOptions
    );
    return obj;
  }

  protected getGeometry(): THREE.Geometry {
    let { side } = this.parameters as IOctahedronParams;
    side = Math.max(0, Number(side));
    const radius = 0.707 * side;
    // this._meshUpdateRequired = false;
    return new THREE.OctahedronGeometry(radius);
  }
}
