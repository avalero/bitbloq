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
 * Last modified  : 2019-01-31 10:34:20
 */

import * as THREE from 'three';
import ObjectsCommon from './ObjectsCommon';
import PrimitiveObject from './PrimitiveObject';
import {
  IViewOptions,
  OperationsArray,
  ICylinderJSON,
  ICylinderParams,
} from './Interfaces';

export default class Cylinder extends PrimitiveObject {
  public static typeName: string = 'Cylinder';

  public static newFromJSON(object: ICylinderJSON): Cylinder {
    if (object.type !== Cylinder.typeName) {
      throw new Error('Not Cylinder Object');
    }
    let cyl: Cylinder;
    let mesh: THREE.Mesh;
    if (object.mesh) {
      mesh = new THREE.ObjectLoader().parse(object.mesh);
      cyl = new Cylinder(
        object.parameters,
        object.operations,
        object.viewOptions,
        mesh
      );
    } else {
      cyl = new Cylinder(
        object.parameters,
        object.operations,
        object.viewOptions
      );
    }

    cyl.id = object.id || cyl.id;
    return cyl;
  }

  constructor(
    parameters: ICylinderParams,
    operations: OperationsArray = [],
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    mesh?: THREE.Mesh | undefined
  ) {
    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...viewOptions,
    };
    super(vO, operations);
    this.type = Cylinder.typeName;
    this.setParameters(parameters);

    if (mesh) {
      this.setMesh(mesh);
    } else {
      this.computeMesh();
      this.meshPromise = null;
    }
  }

  public clone(): Cylinder {
    if (this.mesh && !(this.meshUpdateRequired || this.pendingOperation)) {
      const objCyl = new Cylinder(
        this.parameters as ICylinderParams,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone()
      );
      return objCyl;
    }
    const obj = new Cylinder(
      this.parameters as ICylinderParams,
      this.operations,
      this.viewOptions
    );
    return obj;
  }

  protected getGeometry(): THREE.Geometry {
    let { r0, height } = this.parameters as ICylinderParams;
    r0 = Math.max(0, r0);
    height = Math.max(0, height);
    // this._meshUpdateRequired = false;

    return new THREE.CylinderGeometry(
      Number(r0),
      Number(r0),
      Number(height),
      18,
      1
    ).rotateX(Math.PI / 2);
  }
}
