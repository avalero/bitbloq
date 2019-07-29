/*
 * File: SemiSemiCylinder.ts
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
  IViewOptions,
  OperationsArray,
  ICylinderJSON,
  ICylinderParams,
} from './Interfaces';

export default class SemiCylinder extends PrimitiveObject {
  public static typeName: string = 'SemiCylinder';

  public static newFromJSON(object: ICylinderJSON): SemiCylinder {
    if (object.type !== SemiCylinder.typeName) {
      throw new Error('Not SemiCylinder Object');
    }
    let cyl: SemiCylinder;
    let mesh: THREE.Mesh;
    if (object.mesh) {
      mesh = new THREE.ObjectLoader().parse(object.mesh);
      cyl = new SemiCylinder(
        object.parameters,
        object.operations,
        object.viewOptions,
        mesh
      );
    } else {
      cyl = new SemiCylinder(
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
    this.type = SemiCylinder.typeName;
    this.setParameters(parameters);

    if (mesh) {
      this.setMesh(mesh);
    } else {
      this.computeMesh();
      this.meshPromise = null;
    }
  }

  public clone(): SemiCylinder {
    if (this.mesh && !(this.meshUpdateRequired || this.pendingOperation)) {
      const objCyl = new SemiCylinder(
        this.parameters as ICylinderParams,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone()
      );
      return objCyl;
    }
    const obj = new SemiCylinder(
      this.parameters as ICylinderParams,
      this.operations,
      this.viewOptions
    );
    return obj;
  }

  protected getGeometry(): THREE.Geometry {
    let { r0, height } = this.parameters as ICylinderParams;
    r0 = Number(Math.max(0, r0));
    height = Number(Math.max(0, height));
    // this._meshUpdateRequired = false;

    const semiCircleShape: THREE.Shape = new THREE.Shape();

    semiCircleShape.moveTo(-r0, 0);
    semiCircleShape.lineTo(r0, 0);
    semiCircleShape.absarc(0, 0, r0, 0, Math.PI, false);

    const semiCylGeometry: THREE.ExtrudeGeometry = new THREE.ExtrudeGeometry(
      semiCircleShape,
      {
        depth: height,
        bevelEnabled: false,
        curveSegments: Math.max(6, Math.min(r0 * 5, 12)),
      }
    );

    return semiCylGeometry.translate(0, 0, -height / 2).rotateX(Math.PI / 2);
  }
}
