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
 * Last modified  : 2019-01-03 18:41:43
 */

import lodashIsequal from "lodash.isequal";
import * as THREE from "three";
import ObjectsCommon, { IViewOptions, OperationsArray } from "./ObjectsCommon";
import PrimitiveObject, { IPrimitiveObjectJSON } from "./PrimitiveObject";

/**
 * Params defining a cube (units are in millimiters)
 */
export interface ICubeParams {
  width: number;
  depth: number;
  height: number;
}

export interface ICubeJSON extends IPrimitiveObjectJSON {
  parameters: ICubeParams;
}

export default class Cube extends PrimitiveObject {
  public static typeName: string = "Cube";

  /**
   * Creates a new Cube instance from json
   * @param object object descriptor
   */
  public static newFromJSON(object: ICubeJSON): Cube {
    if (object.type !== Cube.typeName) {
      throw new Error("Not Cube Object");
    }
    const cube = new Cube(
      object.parameters,
      object.operations,
      object.viewOptions
    );

    cube.id = object.id || "";
    return cube;
  }

  constructor(
    parameters: ICubeParams,
    operations: OperationsArray = [],
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    mesh?: THREE.Mesh | undefined
  ) {
    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...viewOptions
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
    if (this.mesh && lodashIsequal(this.lastJSON, this.toJSON())) {
      const cubeObj = new Cube(
        this.parameters as ICubeParams,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone()
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
    this._meshUpdateRequired = false;
    return new THREE.BoxGeometry(Number(width), Number(depth), Number(height));
  }
}
