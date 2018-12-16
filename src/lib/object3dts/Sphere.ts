/**
 * Copyright (c) 2018 Bitbloq (BQ)
 *
 * License: MIT
 *
 * long description for the file
 *
 * @summary short description for the file
 * @author David García <https://github.com/empoalp>, Alberto Valero <https://github.com/avalero>
 *
 * Created at     : 2018-10-16 12:59:30
 * Last modified  : 2018-12-10 09:16:09
 */

import * as THREE from "three";
import isEqual from "lodash.isequal";

import ObjectsCommon, {
  OperationsArray,
  IViewOptions,
  IObjectsCommonJSON
} from "./ObjectsCommon";
import PrimitiveObject from "./PrimitiveObject";

export interface ISphereParams {
  radius: number;
}

export interface ISphereJSON extends IObjectsCommonJSON {
  parameters: ISphereParams;
}

export default class Sphere extends PrimitiveObject {
  public static typeName: string = "Sphere";

  public static newFromJSON(object: ISphereJSON): Sphere {
    if (object.type != Sphere.typeName) throw new Error("Not Sphere Object");
    return new Sphere(object.parameters, object.operations, object.viewOptions);
  }

  constructor(
    parameters: ISphereParams,
    operations: OperationsArray = [],
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    mesh: THREE.Mesh | undefined = undefined
  ) {
    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...viewOptions
    };
    super(vO, operations);
    this.type = Sphere.typeName;
    this.setParameters(parameters);
    this.lastJSON = this.toJSON();
    if (mesh) {
      this.setMesh(mesh);
    } else {
      this.meshPromise = this.computeMeshAsync();
    }
  }

  public clone(): Sphere {
    if (isEqual(this.lastJSON, this.toJSON())) {
      const obj = new Sphere(
        this.parameters as ISphereParams,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone()
      );
      return obj;
    } else {
      const obj = new Sphere(
        this.parameters as ISphereParams,
        this.operations,
        this.viewOptions
      );
      return obj;
    }
  }

  protected getGeometry(): THREE.Geometry {
    let { radius } = this.parameters as ISphereParams;
    radius = Math.max(1, radius);
    this._meshUpdateRequired = false;
    return new THREE.SphereGeometry(
      Number(radius),
      Math.max(12, Math.min(Number(radius) * 5, 16)),
      Math.max(12, Math.min(Number(radius) * 5, 16))
    );
  }

  protected getBufferGeometry(): THREE.BufferGeometry {
    let { radius } = this.parameters as ISphereParams;
    radius = Math.max(1, radius);
    this._meshUpdateRequired = false;
    return new THREE.SphereBufferGeometry(
      Number(radius),
      Math.max(12, Math.min(Number(radius) * 5, 16)),
      Math.max(12, Math.min(Number(radius) * 5, 16))
    );
  }
}
