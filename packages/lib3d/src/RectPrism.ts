/*
 * File: RectPrism.ts
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
  IRectPrismJSON,
  IRectPrismParams,
  IViewOptions,
  OperationsArray,
} from './Interfaces';

export default class RectPrism extends PrimitiveObject {
  public static typeName: string = 'RectPrism';

  /**
   * Creates a new RectPrism instance from json
   * @param object object descriptor
   */
  public static newFromJSON(object: IRectPrismJSON): RectPrism {
    if (object.type !== RectPrism.typeName) {
      throw new Error('Not RectPrism Object');
    }
    let mesh: THREE.Mesh;
    let rectPrism: RectPrism;
    if (object.mesh) {
      mesh = new THREE.ObjectLoader().parse(object.mesh);
      rectPrism = new RectPrism(
        object.parameters,
        object.operations,
        object.viewOptions,
        mesh
      );
    } else {
      rectPrism = new RectPrism(
        object.parameters,
        object.operations,
        object.viewOptions
      );
    }

    rectPrism.id = object.id || rectPrism.id;
    return rectPrism;
  }

  constructor(
    parameters: IRectPrismParams,
    operations: OperationsArray = [],
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    mesh?: THREE.Mesh | undefined
  ) {
    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...viewOptions,
    };
    super(vO, operations);
    this.type = RectPrism.typeName;
    this.setParameters(parameters);

    if (mesh) {
      this.setMesh(mesh);
    } else {
      this.computeMesh();
      this.meshPromise = null;
    }
  }

  /**
   * Creates a rectPrism clone (not sharing references)
   */
  public clone(): RectPrism {
    if (this.mesh && !(this.meshUpdateRequired || this.pendingOperation)) {
      const rectPrismObj = new RectPrism(
        this.parameters as IRectPrismParams,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone()
      );
      return rectPrismObj;
    }

    const rectPrism = new RectPrism(
      this.parameters as IRectPrismParams,
      this.operations,
      this.viewOptions
    );
    return rectPrism;
  }

  protected getGeometry(): THREE.Geometry {
    let { width, height, depth } = this.parameters as IRectPrismParams;
    width = Math.max(0, width);
    height = Math.max(0, height);
    depth = Math.max(0, depth);
    // this._meshUpdateRequired = false;
    return new THREE.BoxGeometry(Number(width), Number(depth), Number(height));
  }
}
