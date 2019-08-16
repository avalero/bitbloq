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
import {
  OperationsArray,
  ITranslateOperation,
  IRotateOperation,
  Operation,
} from './Interfaces';
import { cloneDeep } from 'lodash';

export default class PositionCalculator {
  private operations: OperationsArray;
  private object: ObjectsCommon;
  private position: IObjectPosition;

  constructor(object: ObjectsCommon) {
    this.object = object;
    this.operations = [];
    if (object instanceof CompoundObject) this.object = object.getChildren()[0];
  }

  public async getPositionAsync(): Promise<IObjectPosition> {
    await this.applyOperationsAsync();
    return this.position;
  }

  private toggleRelativity(
    operation: Operation,
    config: { translation: boolean; rotation: boolean } = {
      translation: true,
      rotation: true,
    }
  ) {
    if (config.translation) {
      if (operation.type === ObjectsCommon.createTranslateOperation().type) {
        (operation as ITranslateOperation).relative = !(operation as ITranslateOperation)
          .relative;
      }
    }

    if (config.rotation) {
      if (operation.type === ObjectsCommon.createRotateOperation().type) {
        (operation as IRotateOperation).relative = !(operation as IRotateOperation)
          .relative;
      }
    }

    return operation;
  }

  private setRelativity(operation: Operation, value: boolean) {
    if (
      operation.type === ObjectsCommon.createRotateOperation().type ||
      operation.type === ObjectsCommon.createTranslateOperation().type
    ) {
      (operation as (ITranslateOperation | IRotateOperation)).relative = value;
    }

    return operation;
  }

  private async applyOperationsAsync(): Promise<void> {
    let parents: ObjectsCommon[] = [];
    let obj: ObjectsCommon | undefined = this.object;

    while (obj) {
      parents = [obj, ...parents];
      obj = obj.getParent();
    }

    this.operations = cloneDeep(parents[0].getOperations());

    for (let i = 1; i < parents.length; i += 1) {
      const parent = parents[i].getParent();
      const child = parents[i];
      if (parent instanceof Union) {
        if (parent.getChildren()[0].getID() === child.getID()) {
          // this child is the first object of an Union
          // prepend operations without any change
          this.operations = [
            ...cloneDeep(child.getOperations()),
            ...this.operations,
          ];
        } else {
          // append operation toggling relativity
          this.operations.push(
            ...cloneDeep(child.getOperations()).map(op =>
              this.toggleRelativity(op)
            )
          );
        }
      }
    }

    // this.operations = [
    //   ...cloneDeep(parents[0].getOperations()).map(op =>
    //     this.toggleRelativity(op)
    //   ),
    // ];

    // for (let i = 1; i < parents.length; i += 1) {
    //   this.operations.push(
    //     ...cloneDeep(parents[i].getOperations()).map(op =>
    //       this.toggleRelativity(op, {
    //         translation: false,
    //         rotation: true,
    //       })
    //     )
    //   );
    // }

    const dummyObj = new DummyObject();
    dummyObj.setOperations(this.operations);

    await dummyObj.computeMeshAsync();
    const mesh = await dummyObj.getMeshAsync();
    this.position = {
      position: {
        x: mesh.position.x,
        y: mesh.position.y,
        z: mesh.position.z,
      },
      angle: {
        x: (mesh.rotation.x * 180) / Math.PI,
        y: (mesh.rotation.y * 180) / Math.PI,
        z: (mesh.rotation.z * 180) / Math.PI,
      },
      scale: {
        x: mesh.scale.x,
        y: mesh.scale.y,
        z: mesh.scale.z,
      },
    };
  }
}

import DummyObject from './DummyObject';
import Union from './Union';
import CompoundObject from './CompoundObject';
