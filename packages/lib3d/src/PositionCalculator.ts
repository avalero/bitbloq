/*
 * File: PositionCalculator.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Bitbloq Repository: https://github.com/bitbloq
 * Bitbloq Team: https://github.com/orgs/Bitbloq/people
 * Copyright 2018 - 2019 BQ Educacion.
 */

import ObjectsCommon from './ObjectsCommon';
import { IObjectPosition } from './Scene';
import * as THREE from 'three';

export default class PositionCalculator {
  private object: ObjectsCommon;
  private position: IObjectPosition;
  private matrix: THREE.Matrix4;

  constructor(object: ObjectsCommon) {
    this.object = object;
  }

  public async getPositionAsync(): Promise<IObjectPosition> {
    await this.computeMatrixAsync();

    const pos: THREE.Vector3 = new THREE.Vector3();
    const quaternion: THREE.Quaternion = new THREE.Quaternion();
    const scale: THREE.Vector3 = new THREE.Vector3();

    this.matrix.decompose(pos, quaternion, scale);
    const euler: THREE.Euler = new THREE.Euler().setFromQuaternion(quaternion);

    this.position = {
      position: { x: pos.x, y: pos.y, z: pos.z },
      angle: {
        x: (euler.x * 180) / Math.PI,
        y: (euler.y * 180) / Math.PI,
        z: (euler.z * 180) / Math.PI,
      },
      scale: { x: scale.x, y: scale.y, z: scale.z },
    };

    return this.position;
  }

  public getMatrix(): THREE.Matrix4 {
    return this.matrix;
  }

  private async computeMatrixAsync(): Promise<THREE.Matrix4> {
    const obj = this.object;
    const parent = obj.getParent();

    const mesh = await obj.getMeshAsync();
    const myMatrix = mesh.matrix.clone();
    if (!parent) {
      if (mesh instanceof THREE.Mesh) {
        this.matrix = myMatrix;
        return this.matrix;
      }
    } else {
      if (parent instanceof CompoundObject) {
        const parentPosCalculator = new PositionCalculator(parent);
        const parentMatrix = await parentPosCalculator.computeMatrixAsync();

        // if obj is the 1st children, its position is its parent position
        if (obj.getID() === parent.getChildren()[0].getID()) {
          this.matrix = parentMatrix;
          return this.matrix;
        }

        // object is not the primary object

        // get matrix of primary child
        // const primusPosCalculator = new PositionCalculator(
        //   parent.getChildren()[0]
        // );
        const primusMesh = await parent.getChildren()[0].getMeshAsync();
        const primusMatrix = primusMesh.matrix;

        // remove the primus matrix operations to my matrix
        myMatrix.premultiply(new THREE.Matrix4().getInverse(primusMatrix));

        // compose parent position with my position
        this.matrix = parentPosCalculator.matrix.multiply(myMatrix);

        return this.matrix;
      }
    }

    this.matrix = new THREE.Matrix4();
    return this.matrix;
  }
}

import DummyObject from './DummyObject';
import Union from './Union';
import CompoundObject from './CompoundObject';
