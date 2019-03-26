/**
 * License: MIT
 *
 * long description for the file
 *
 * @summary short description for the file
 * @author Alberto Valero <https://github.com/avalero>
 *
 * Created at     : 2019-01-10 11:23:22
 * Last modified  : 2019-01-31 09:52:17
 */

import * as THREE from "three";
import ObjectsCommon from "./ObjectsCommon";
import PrimitiveObject from "./PrimitiveObject";

import {
  OperationsArray,
  IViewOptions,
  IPyramidParams,
  IPyramidJSON
} from "./Interfaces";

export default class Pyramid extends PrimitiveObject {
  public static typeName: string = "Pyramid";

  public static newFromJSON(object: IPyramidJSON): Pyramid {
    if (object.type !== Pyramid.typeName) {
      throw new Error("Not Pyramid Object");
    }
    let pyramid: Pyramid;
    let mesh: THREE.Mesh;
    if (object.mesh) {
      mesh = new THREE.ObjectLoader().parse(object.mesh);
      pyramid = new Pyramid(
        object.parameters,
        object.operations,
        object.viewOptions,
        mesh
      );
    } else {
      pyramid = new Pyramid(
        object.parameters,
        object.operations,
        object.viewOptions
      );
    }
    pyramid.id = object.id || pyramid.id;

    return pyramid;
  }

  constructor(
    parameters: IPyramidParams,
    operations: OperationsArray = [],
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    mesh?: THREE.Mesh | undefined
  ) {
    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...viewOptions
    };
    super(vO, operations);
    this.type = Pyramid.typeName;
    this.setParameters(parameters);

    if (mesh) {
      this.setMesh(mesh);
    } else {
      this.computeMesh();
      this.meshPromise = null;
    }
  }

  public clone(): Pyramid {
    if (this.mesh && !(this.meshUpdateRequired || this.pendingOperation)) {
      const objPrism = new Pyramid(
        this.parameters as IPyramidParams,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone()
      );
      return objPrism;
    }
    const obj = new Pyramid(
      this.parameters as IPyramidParams,
      this.operations,
      this.viewOptions
    );
    return obj;
  }

  protected getGeometry(): THREE.Geometry {
    let { sides, length, height } = this.parameters as IPyramidParams;
    sides = Math.max(3, sides);
    length = Math.max(0, length);
    height = Math.max(0, height);
    // this._meshUpdateRequired = false;
    const radius: number = length / (2 * Math.sin(Math.PI / sides));
    return new THREE.CylinderGeometry(
      0,
      Number(radius),
      Number(height),
      Number(sides)
    )
      .rotateX(Math.PI / 2)
      .rotateZ(Math.PI / 4);
  }
}
