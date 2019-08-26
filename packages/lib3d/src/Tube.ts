/*
 * File: Tube.ts
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
  ITubeJSON,
  ITubeParams,
} from './Interfaces';

export default class Tube extends PrimitiveObject {
  public static typeName: string = 'Tube';

  public static newFromJSON(object: ITubeJSON): Tube {
    if (object.type !== Tube.typeName) {
      throw new Error('Not Tube Object');
    }
    let tube: Tube;
    let mesh: THREE.Mesh;
    if (object.mesh) {
      mesh = new THREE.ObjectLoader().parse(object.mesh);
      tube = new Tube(
        object.parameters,
        object.operations,
        object.viewOptions,
        mesh
      );
    } else {
      tube = new Tube(object.parameters, object.operations, object.viewOptions);
    }

    tube.id = object.id || tube.id;
    return tube;
  }

  constructor(
    parameters: ITubeParams,
    operations: OperationsArray = [],
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    mesh?: THREE.Mesh | undefined
  ) {
    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...viewOptions,
    };
    super(vO, operations);
    this.type = Tube.typeName;
    this.setParameters(parameters);

    if (mesh) {
      this.setMesh(mesh);
    } else {
      this.computeMesh();
      this.meshPromise = null;
    }
  }

  public clone(): Tube {
    if (this.mesh && !(this.meshUpdateRequired || this.pendingOperation)) {
      const objCyl = new Tube(
        this.parameters as ITubeParams,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone()
      );
      return objCyl;
    }
    const obj = new Tube(
      this.parameters as ITubeParams,
      this.operations,
      this.viewOptions
    );
    return obj;
  }

  protected getGeometry(): THREE.Geometry {
    let { r0, r1, height } = this.parameters as ITubeParams;
    r0 = Number(Math.max(0, r0));
    r1 = Number(Math.max(0, r1));
    height = Number(Math.max(0, height));
    // this._meshUpdateRequired = false;

    const outerCircleShape: THREE.Shape = new THREE.Shape();

    outerCircleShape.moveTo(-r0, 0);
    // outerCircleShape.lineTo(r0, 0);
    outerCircleShape.absarc(0, 0, r0, 0, 2 * Math.PI, false);

    const innerCircleShape: THREE.Shape = new THREE.Shape();

    innerCircleShape.moveTo(-r1, 0);
    // innerCircleShape.lineTo(r0, 0);
    innerCircleShape.absarc(0, 0, r1, 0, 2 * Math.PI, false);

    outerCircleShape.holes.push(innerCircleShape);

    const tubeGeometry: THREE.ExtrudeGeometry = new THREE.ExtrudeGeometry(
      outerCircleShape,
      {
        depth: height,
        bevelEnabled: false,
        curveSegments: Math.max(6, Math.min(r0 * 5, 12)),
      }
    );

    return tubeGeometry.translate(0, 0, -height / 2);
  }
}
