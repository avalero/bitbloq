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
 * Created at     : 2018-10-16 12:59:38
 * Last modified  : 2019-01-31 10:37:50
 */

import * as THREE from "three";
import ObjectsCommon from "./ObjectsCommon";
import PrimitiveObject from "./PrimitiveObject";

import {
  IViewOptions,
  OperationsArray,
  IPrismParams,
  IPrismJSON
} from "./Interfaces";

export default class Prism extends PrimitiveObject {
  public static typeName: string = "Prism";

  public static newFromJSON(object: IPrismJSON): Prism {
    if (object.type !== Prism.typeName) {
      throw new Error("Not Prism Object");
    }
    let prism: Prism;
    let mesh: THREE.Mesh;
    if (object.mesh) {
      mesh = new THREE.ObjectLoader().parse(object.mesh);
      prism = new Prism(
        object.parameters,
        object.operations,
        object.viewOptions,
        mesh
      );
    } else {
      prism = new Prism(
        object.parameters,
        object.operations,
        object.viewOptions
      );
    }
    prism.id = object.id || prism.id;

    return prism;
  }

  constructor(
    parameters: IPrismParams,
    operations: OperationsArray = [],
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    mesh?: THREE.Mesh | undefined
  ) {
    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...viewOptions
    };
    super(vO, operations);
    this.type = Prism.typeName;
    this.setParameters(parameters);

    if (mesh) {
      this.setMesh(mesh);
    } else {
      this.computeMesh();
      this.meshPromise = null;
    }
  }

  public clone(): Prism {
    if (this.mesh && !(this.meshUpdateRequired || this.pendingOperation)) {
      const objPrism = new Prism(
        this.parameters as IPrismParams,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone()
      );
      return objPrism;
    }
    const obj = new Prism(
      this.parameters as IPrismParams,
      this.operations,
      this.viewOptions
    );
    return obj;
  }

  protected getGeometry(): THREE.Geometry {
    let { sides, length, height } = this.parameters as IPrismParams;
    sides = Math.max(3, sides);
    length = Math.max(0, length);
    height = Math.max(0, height);
    // this._meshUpdateRequired = false;
    const radius: number = length / (2 * Math.sin(Math.PI / sides));
    return new THREE.CylinderGeometry(
      Number(radius),
      Number(radius),
      Number(height),
      Number(sides)
    ).rotateX(Math.PI / 2);
  }
}
