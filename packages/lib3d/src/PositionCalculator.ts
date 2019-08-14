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
  IScaleOperation,
} from './Interfaces';
import { cloneDeep } from 'lodash';

export default class PositionCalculator {
  private operations: OperationsArray;
  private object: ObjectsCommon;
  private position: IObjectPosition;

  constructor(object: ObjectsCommon) {
    this.object = object;
    this.operations = this.rebuildOperations();
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

  private getOperations(): OperationsArray {
    return this.operations;
  }

  private inverseOperation(op: Operation) {
    if (op.type === ObjectsCommon.createTranslateOperation().type) {
      const operation = op as ITranslateOperation;
      operation.x = -operation.x;
      operation.y = -operation.y;
      operation.z = -operation.z;
    } else if (op.type === ObjectsCommon.createRotateOperation().type) {
      const operation = op as IRotateOperation;
      operation.x = -operation.x;
      operation.y = -operation.y;
      operation.z = -operation.z;
    } else if (op.type === ObjectsCommon.createScaleOperation().type) {
      const operation = op as IScaleOperation;
      operation.x = operation.x !== 0 ? 1.0 / operation.x : 1;
      operation.y = operation.y !== 0 ? 1.0 / operation.y : 1;
      operation.z = operation.z !== 0 ? 1.0 / operation.z : 1;
    }
    return op;
  }

  private compoundBottomUpOperations(obj: CompoundObject): OperationsArray {
    let children0Operations: OperationsArray = [];

    // let's go down to the bottom non compound object
    let children0: ObjectsCommon | CompoundObject = obj;
    while (children0 instanceof CompoundObject) {
      children0 = children0.getChildren()[0];
    }
    // this children0 is the bottom non Compound
    children0Operations = cloneDeep(children0.getOperations());

    // let's go up through all the parents
    let childrenParent = children0.getParent();
    while (childrenParent) {
      children0Operations = [
        ...children0Operations,
        ...cloneDeep(childrenParent.getOperations()),
      ];
      childrenParent = childrenParent.getParent();
    }

    return children0Operations;
  }

  private rebuildOperations(): OperationsArray {
    const parent = this.object.getParent();
    const obj = this.object;

    debugger;
    if (parent) {
      if (parent instanceof CompoundObject) {
        // If it is the first object of the Compound, its referencie system is the master
        if (parent.getChildren()[0].getID() === obj.getID()) {
          return [...new PositionCalculator(parent).getOperations()];
        }
        // If it is not the reference object (it's not the first)
        // TO CHECK

        const inverseOperations = this.compoundBottomUpOperations(parent).map(
          op => this.inverseOperation(op)
        );

        // cloneDeep(
        // parent.getChildren()[0].getOperations() as OperationsArray
        // ).map(op => this.inverseOperation(op));

        return [
          ...new PositionCalculator(parent).getOperations(),
          ...inverseOperations.map(op => this.toggleRelativity(op)),
          ...cloneDeep(obj.getOperations()).map(op =>
            this.toggleRelativity(op)
          ),
        ];
      }

      // It's not CompoundObject (but has a parent)
      // TODO
      return [];
    }

    // It has no parent
    if (obj instanceof CompoundObject) {
      // When first order object is a CompoundObject we have to go all
      // the way down into the object tree and build the operations
      // from bottom up.

      return this.compoundBottomUpOperations(obj);
    }

    return cloneDeep(obj.getOperations());
  }

  private async applyOperationsAsync(): Promise<void> {
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
