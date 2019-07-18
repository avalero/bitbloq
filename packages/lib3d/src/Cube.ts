/*
 * File: Cube.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Bitbloq Repository: https://github.com/bitbloq
 * Bitbloq Team: https://github.com/orgs/Bitbloq/people
 * Copyright 2018 - 2019 BQ Educacion.
 */

import * as THREE from 'three';
import ObjectsCommon from './ObjectsCommon';
import PrimitiveObject from './PrimitiveObject';
import BSPNode from './threecsg/BSPNode';

import {
  ICubeJSON,
  ICubeParams,
  IViewOptions,
  OperationsArray,
} from './Interfaces';

export default class Cube extends PrimitiveObject {
  public static typeName: string = 'Cube';

  /**
   * Creates a new Cube instance from json
   * @param object object descriptor
   */
  public static newFromJSON(object: ICubeJSON): Cube {
    if (object.type !== Cube.typeName) {
      throw new Error('Not Cube Object');
    }
    let mesh: THREE.Mesh;
    let cube: Cube;
    if (object.mesh) {
      mesh = new THREE.ObjectLoader().parse(object.mesh);
      cube = new Cube(
        object.parameters,
        object.operations,
        object.viewOptions,
        mesh
      );
    } else {
      cube = new Cube(object.parameters, object.operations, object.viewOptions);
    }

    cube.id = object.id || cube.id;
    return cube;
  }

  constructor(
    parameters: ICubeParams,
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
    this.type = Cube.typeName;
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

  /**
   * Creates a cube clone (not sharing references)
   */
  public clone(): Cube {
    if (this.mesh && !(this.meshUpdateRequired || this.pendingOperation)) {
      const cubeObj = new Cube(
        this.parameters as ICubeParams,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone(),
        this.bspNodeBuffer.slice(0)
      );
      return cubeObj;
    }

    const cube = new Cube(
      this.parameters as ICubeParams,
      this.operations,
      this.viewOptions
    );
    return cube;
  }

  protected getGeometry(): THREE.Geometry {
    let { width, height, depth } = this.parameters as ICubeParams;
    width = Math.max(0, width);
    height = Math.max(0, height);
    depth = Math.max(0, depth);
    // this._meshUpdateRequired = false;
    return new THREE.BoxGeometry(Number(width), Number(depth), Number(height));
  }
}
