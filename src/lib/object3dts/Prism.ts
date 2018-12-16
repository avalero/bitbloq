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
 * Last modified  : 2018-12-16 08:55:16
 */

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
 * Created at     : 2018-10-02 19:16:51
 * Last modified  : 2018-10-16 12:51:01
 */

import isEqual from "lodash.isequal";
import * as THREE from "three";
import ObjectsCommon, {
  IObjectsCommonJSON,
  IViewOptions,
  OperationsArray
} from "./ObjectsCommon";
import PrimitiveObject from "./PrimitiveObject";

export interface IPrismParams {
  sides: number;
  length: number;
  height: number;
}

export interface IPrismJSON extends IObjectsCommonJSON {
  parameters: IPrismParams;
}

export default class Prism extends PrimitiveObject {
  public static typeName: string = "Prism";

  public static newFromJSON(object: IPrismJSON): Prism {
    if (object.type != Prism.typeName) {
      throw new Error("Not Prism Object");
    }
    return new Prism(object.parameters, object.operations, object.viewOptions);
  }

  constructor(
    parameters: IPrismParams,
    operations: OperationsArray = [],
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    mesh: THREE.Mesh | undefined = undefined
  ) {
    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...viewOptions
    };
    super(vO, operations);
    this.type = Prism.typeName;
    this.setParameters(parameters);
    this.lastJSON = this.toJSON();
    if (mesh) {
      this.setMesh(mesh);
    } else {
      this.meshPromise = this.computeMeshAsync();
    }
  }

  public clone(): Prism {
    if (this.mesh && isEqual(this.lastJSON, this.toJSON())) {
      const obj = new Prism(
        this.parameters as IPrismParams,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone()
      );
      return obj;
    } else {
      const obj = new Prism(
        this.parameters as IPrismParams,
        this.operations,
        this.viewOptions
      );
      return obj;
    }
  }

  protected getGeometry(): THREE.Geometry {
    let { sides, length, height } = this.parameters as IPrismParams;
    sides = Math.max(3, sides);
    (length = Math.max(1, length)), (height = Math.max(1, height));
    this._meshUpdateRequired = false;
    const radius: number = length / (2 * Math.sin(Math.PI / sides));
    return new THREE.CylinderGeometry(
      Number(radius),
      Number(radius),
      Number(height),
      Number(sides)
    ).rotateX(Math.PI / 2);
  }

  protected getBufferGeometry(): THREE.BufferGeometry {
    let { sides, length, height } = this.parameters as IPrismParams;
    sides = Math.max(3, sides);
    (length = Math.max(1, length)), (height = Math.max(1, height));
    this._meshUpdateRequired = false;
    const radius: number = length / (2 * Math.sin(Math.PI / sides));
    return new THREE.CylinderBufferGeometry(
      Number(radius),
      Number(radius),
      Number(height),
      Number(sides)
    ).rotateX(Math.PI / 2);
  }
}
