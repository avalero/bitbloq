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
 * Last modified  : 2018-11-16 17:32:50
 */

import * as THREE from 'three';
import ObjectsCommon, { OperationsArray, IViewOptions } from './ObjectsCommon';
import PrimitiveObject, { IPrimitiveObjectJSON } from './PrimitiveObject';
import isEqual from 'lodash.isequal';

/**
 * Params defining a cube (units are in millimiters)
 */
interface ICubeParams {
  width: number;
  depth: number;
  height: number;
}

export interface ICubeJSON extends IPrimitiveObjectJSON {
  parameters: ICubeParams;
}

export default class Cube extends PrimitiveObject {
  public static typeName: string = 'Cube';

  /**
   * Creates a new Cube instance from json
   * @param object object descriptor
   */
  public static newFromJSON(object: ICubeJSON): Cube {
    if (object.type != Cube.typeName) throw new Error('Not Cube Object');
    return new Cube(object.parameters, object.operations, object.viewOptions);
  }

  constructor(
    parameters: ICubeParams,
    operations: OperationsArray = [],
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    mesh: THREE.Mesh | undefined = undefined,
  ) {
    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...viewOptions,
    };
    super(vO, operations);
    this.type = Cube.typeName;
    this.setParameters(parameters);
    this.lastJSON = this.toJSON();
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
    if (isEqual(this.lastJSON, this.toJSON())) {
      const cube = new Cube(
        this.parameters as ICubeParams,
        this.operations,
        this.viewOptions,
        this.mesh.clone(),
      );
      return cube;
    } else {
      const cube = new Cube(
        this.parameters as ICubeParams,
        this.operations,
        this.viewOptions,
      );
      return cube;
    }
  }

  protected getGeometry(): THREE.Geometry {
    let { width, height, depth } = this.parameters as ICubeParams;
    width = Math.max(1, width);
    height = Math.max(1, height);
    depth = Math.max(1, depth);
    this._meshUpdateRequired = false;
    return new THREE.BoxGeometry(Number(width), Number(depth), Number(height));
  }

  protected getBufferGeometry(): THREE.BufferGeometry {
    let { width, height, depth } = this.parameters as ICubeParams;
    width = Math.max(1, width);
    height = Math.max(1, height);
    depth = Math.max(1, depth);
    this._meshUpdateRequired = false;
    return new THREE.BoxBufferGeometry(
      Number(width),
      Number(depth),
      Number(height),
    );
  }
}
