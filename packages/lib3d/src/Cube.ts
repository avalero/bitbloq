/**
 * Copyright (c) 2018 Bitbloq (BQ)
 *
 * License: MIT
 *
 * long description for the file
 *
 * @summary short description for the file
 * @author David García <https://github.com/empoalp>,
 * @author Alberto Valero <https://github.com/avalero>
 *
 * Created at     : 2018-10-02 19:16:51
 * Last modified  : 2019-01-31 10:33:27
 */

import * as THREE from 'three';
import ObjectsCommon from './ObjectsCommon';
import PrimitiveObject from './PrimitiveObject';

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
        mesh,
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
      this.meshPromise = this.computeMeshAsync();
    }
  }

  /**
   * Creates a cube clone (not sharing references)
   */
  public clone(): Cube {
    if (
      this.mesh &&
      !(
        this.meshUpdateRequired ||
        this.pendingOperation
      )
    ) {
      const cubeObj = new Cube(
        this.parameters as ICubeParams,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone(),
      );
      return cubeObj;
    }

    const cube = new Cube(
      this.parameters as ICubeParams,
      this.operations,
      this.viewOptions,
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
