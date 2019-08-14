/*
 * File: PositionCalculator.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Bitbloq Repository: https://github.com/bitbloq
 * Bitbloq Team: https://github.com/orgs/Bitbloq/people
 * Copyright 2018 - 2019 BQ Educacion.
 */

import ObjectsCommon from "./ObjectsCommon";
import { IObjectPosition } from "./Scene";
import {
  OperationsArray,
  ITranslateOperation,
  IRotateOperation
} from "./Interfaces";
import Object3D from "./Object3D";
import { cloneDeep } from "lodash";

export default class PositionCalculator {
  private operations: OperationsArray;
  private object: ObjectsCommon;
  private position: IObjectPosition;

  constructor(object: ObjectsCommon) {
    this.object = object;
    this.operations = [];
  }

  public async getPositionAsync(): Promise<IObjectPosition> {
    await this.applyOperationsAsync();
    return this.position;
  }

  private async applyOperationsAsync(): Promise<void> {
    let parents: ObjectsCommon[] = [];
    let obj: ObjectsCommon | undefined = this.object;

    while (obj) {
      parents = [obj, ...parents];
      obj = obj.getParent();
    }

    this.operations = [];

    const dummyObj = new DummyObject();
    dummyObj.addOperations(this.operations);

    await dummyObj.computeMeshAsync();
    const mesh = await dummyObj.getMeshAsync();
    this.position = {
      position: {
        x: mesh.position.x,
        y: mesh.position.y,
        z: mesh.position.z
      },
      angle: {
        x: (mesh.rotation.x * 180) / Math.PI,
        y: (mesh.rotation.y * 180) / Math.PI,
        z: (mesh.rotation.z * 180) / Math.PI
      },
      scale: {
        x: mesh.scale.x,
        y: mesh.scale.y,
        z: mesh.scale.z
      }
    };
  }

  private prePushOperations(operations: OperationsArray): void {
    this.operations = [...operations, ...this.operations];
  }
}

import DummyObject from "./DummyObject";
