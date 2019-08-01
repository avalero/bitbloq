/*
 * File: Heart.ts
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
  IHeartJSON,
  IHeartParams,
} from './Interfaces';

export default class Heart extends PrimitiveObject {
  public static typeName: string = 'Heart';

  public static newFromJSON(object: IHeartJSON): Heart {
    if (object.type !== Heart.typeName) {
      throw new Error('Not Heart Object');
    }
    let heart: Heart;
    let mesh: THREE.Mesh;
    if (object.mesh) {
      mesh = new THREE.ObjectLoader().parse(object.mesh);
      heart = new Heart(
        object.parameters,
        object.operations,
        object.viewOptions,
        mesh
      );
    } else {
      heart = new Heart(
        object.parameters,
        object.operations,
        object.viewOptions
      );
    }

    heart.id = object.id || heart.id;
    return heart;
  }

  constructor(
    parameters: IHeartParams,
    operations: OperationsArray = [],
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    mesh?: THREE.Mesh | undefined
  ) {
    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...viewOptions,
    };
    super(vO, operations);
    this.type = Heart.typeName;
    this.setParameters(parameters);

    if (mesh) {
      this.setMesh(mesh);
    } else {
      this.computeMesh();
      this.meshPromise = null;
    }
  }

  public clone(): Heart {
    if (this.mesh && !(this.meshUpdateRequired || this.pendingOperation)) {
      const objCyl = new Heart(
        this.parameters as IHeartParams,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone()
      );
      return objCyl;
    }
    const obj = new Heart(
      this.parameters as IHeartParams,
      this.operations,
      this.viewOptions
    );
    return obj;
  }

  protected getGeometry(): THREE.Geometry {
    let { side, height } = this.parameters as IHeartParams;
    side = Math.max(0, Number(side));
    height = Math.max(0, Number(height));

    const heartShape = new THREE.Shape(); // From http://blog.burlock.org/html5/130-paths

    const x = -25;
    const y = -25;
    const factor = side / 95.0;
    heartShape.moveTo((x + 25) * factor, (y + 25) * factor);
    heartShape.bezierCurveTo(
      (x + 25) * factor,
      (y + 25) * factor,
      (x + 20) * factor,
      y * factor,
      x * factor,
      y * factor
    );
    heartShape.bezierCurveTo(
      (x - 30) * factor,
      y * factor,
      (x - 30) * factor,
      (y + 35) * factor,
      (x - 30) * factor,
      (y + 35) * factor
    );
    heartShape.bezierCurveTo(
      (x - 30) * factor,
      (y + 55) * factor,
      (x - 10) * factor,
      (y + 77) * factor,
      (x + 25) * factor,
      (y + 95) * factor
    );
    heartShape.bezierCurveTo(
      (x + 60) * factor,
      (y + 77) * factor,
      (x + 80) * factor,
      (y + 55) * factor,
      (x + 80) * factor,
      (y + 35) * factor
    );
    heartShape.bezierCurveTo(
      (x + 80) * factor,
      (y + 35) * factor,
      (x + 80) * factor,
      y * factor,
      (x + 50) * factor,
      y * factor
    );
    heartShape.bezierCurveTo(
      (x + 35) * factor,
      y * factor,
      (x + 25) * factor,
      (y + 25) * factor,
      (x + 25) * factor,
      (y + 25) * factor
    );

    const heartGeometry: THREE.ExtrudeGeometry = new THREE.ExtrudeGeometry(
      heartShape,
      {
        depth: height,
        bevelEnabled: false,
      }
    );

    return heartGeometry.translate(0, 0, -height / 2).rotateZ(Math.PI);
  }
}
