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
 * Last modified  : 2018-12-28 14:20:51
 */

import * as THREE from "three";
import ObjectsCommon from "./ObjectsCommon";
import Object3D from "./Object3D";

export default class DummyObject extends Object3D {
  public static typeName: string = "Dummy";

  /**
   * Creates a new Cube instance from json
   * @param object object descriptor
   */

  constructor() {
    super(ObjectsCommon.createViewOptions(), []);
    this.type = DummyObject.typeName;
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial();
    this.mesh = new THREE.Mesh(geometry, material);
  }

  /**
   * Creates a dummy clone (not sharing references)
   */
  public clone(): DummyObject {
    const obj = new DummyObject();
    obj.setOperations([...this.operations]);
    return obj;
  }

  public async computeMeshAsync(): Promise<THREE.Mesh> {
    this.meshPromise = new Promise(async (resolve, reject) => {
      if (this.pendingOperation) {
        await this.applyOperationsAsync();
      }
      resolve(this.mesh);
    });
    return this.meshPromise as Promise<THREE.Mesh>;
  }
}
