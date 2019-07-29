/*
 * File: Star.ts
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
  IStarJSON,
  IStarParams,
} from './Interfaces';

export default class Star extends PrimitiveObject {
  public static typeName: string = 'Star';

  public static newFromJSON(object: IStarJSON): Star {
    if (object.type !== Star.typeName) {
      throw new Error('Not Star Object');
    }
    let star: Star;
    let mesh: THREE.Mesh;
    if (object.mesh) {
      mesh = new THREE.ObjectLoader().parse(object.mesh);
      star = new Star(
        object.parameters,
        object.operations,
        object.viewOptions,
        mesh
      );
    } else {
      star = new Star(object.parameters, object.operations, object.viewOptions);
    }

    star.id = object.id || star.id;
    return star;
  }

  constructor(
    parameters: IStarParams,
    operations: OperationsArray = [],
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    mesh?: THREE.Mesh | undefined
  ) {
    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...viewOptions,
    };
    super(vO, operations);
    this.type = Star.typeName;
    this.setParameters(parameters);

    if (mesh) {
      this.setMesh(mesh);
    } else {
      this.computeMesh();
      this.meshPromise = null;
    }
  }

  public clone(): Star {
    if (this.mesh && !(this.meshUpdateRequired || this.pendingOperation)) {
      const objCyl = new Star(
        this.parameters as IStarParams,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone()
      );
      return objCyl;
    }
    const obj = new Star(
      this.parameters as IStarParams,
      this.operations,
      this.viewOptions
    );
    return obj;
  }

  protected getGeometry(): THREE.Geometry {
    let { r0, r1, height, peaks } = this.parameters as IStarParams;
    r0 = Number(Math.max(0, r0));
    r1 = Number(Math.max(0, r1));
    height = Number(Math.max(0, height));
    peaks = Number(Math.max(3, peaks));
    // this._meshUpdateRequired = false;

    const starShape: THREE.Shape = new THREE.Shape();

    starShape.moveTo(r0, 0);

    const angleStep: number = Math.PI / peaks;
    let angle: number = 0;
    debugger;
    for (let i = 1; i <= peaks; i += 1) {
      angle += angleStep;
      let x = r1 * Math.cos(angle);
      let y = r1 * Math.sin(angle);
      starShape.lineTo(x, y);
      angle += angleStep;
      x = r0 * Math.cos(angle);
      y = r0 * Math.sin(angle);
      starShape.lineTo(x, y);
    }

    // outerCircleShape.lineTo(r0, 0);

    const starGeometry: THREE.ExtrudeGeometry = new THREE.ExtrudeGeometry(
      starShape,
      {
        depth: height,
        bevelEnabled: false,
      }
    );

    return starGeometry.translate(0, 0, -height / 2);
  }
}
