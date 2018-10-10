/**
 * Copyright (c) 2018 Bitbloq (BQ)
 *
 * License: MIT
 *
 * long description for the file
 *
 * @summary short description for the file
 * @author David García <https://github.com/empoalp>, Alberto Valero <https://github.com/avalero>
 *
 * Created at     : 2018-10-02 18:56:46
 * Last modified  : 2018-10-10 11:48:03
 */

import * as THREE from 'three';

interface ICommonOperation {
  type: string;
}

interface ITranslateOperation extends ICommonOperation {
  x: number;
  y: number;
  z: number;
  relative: boolean;
}

interface IRotateOperation extends ICommonOperation {
  axis: string;
  angle: number;
  relative: boolean;
}

interface IScaleOperation extends ICommonOperation {
  x: number;
  y: number;
  z: number;
}

type Operation = ITranslateOperation | IRotateOperation | IScaleOperation;
export type OperationsArray = Array<Operation>;

export class Object3D {
  public static createTranslateOperation(
    x: number = 0,
    y: number = 0,
    z: number = 0,
    relative: boolean = true,
  ): ITranslateOperation {
    return {
      type: 'translation',
      x,
      y,
      z,
      relative,
    };
  }

  public static createRotateOperation(
    axis: string = 'x',
    angle: number = 0,
    relative: boolean = true,
  ): IRotateOperation {
    return {
      type: 'rotation',
      axis,
      angle,
      relative,
    };
  }

  public static createScaleOperation(
    x: number = 1,
    y: number = 1,
    z: number = 1,
  ): IScaleOperation {
    return {
      type: 'scale',
      x,
      y,
      z,
    };
  }

  public static colors: string[] = [
    '#e300ff',
    '#b0ff00',
    '#00ffd2',
    '#fdff00',
    '#ff00f4',
    '#00fff8',
    '#f9fe44',
    '#7aff4f',
    '#968afc',
  ];

  protected mesh: THREE.Mesh;
  // protected scene: BABYLON.Scene;
  protected color: string;
  private operations: OperationsArray;
  private pendingOperation: boolean;
  protected _updateRequired: boolean;

  constructor(operations: OperationsArray = []) {
    this.operations = operations;
    this.pendingOperation = true;
    const color_index: number = Math.floor(
      Math.random() * Object3D.colors.length,
    );
    this.color = Object3D.colors[color_index];
  }

  get updateRequired():boolean{
    return this._updateRequired;
  }

  public addOperation(operation: Operation): void {
    this.operations.push(operation);
    this.pendingOperation = true;
  }

  public setOperations(operations: OperationsArray): void {
    this.operations = [];
    this.operations = operations.slice();
    this.pendingOperation = true;
  }

  public setColor(color: string): void {
    this.color = color;
  }

  protected getMaterial(): THREE.MeshLambertMaterial {
    return new THREE.MeshLambertMaterial({
      color: this.color || Object3D.colors[0],
    });
  }

  public getMesh(): THREE.Mesh {
    if (this._updateRequired) {
      const geometry: THREE.Geometry = this.getGeometry();
      this.mesh = new THREE.Mesh(geometry, this.getMaterial());
      this._updateRequired = false;
    }

    this.applyOperations();

    return this.mesh;
  }

  protected getGeometry(): THREE.Geometry {
    throw new Error('ERROR. Pure Virtual Function implemented in children');
  }

  protected applyOperations() {
    if (this.pendingOperation) {
      this.operations.forEach(operation => {
        // Translate operation
        if (operation.type === Object3D.createTranslateOperation().type) {
          this.applyTranslateOperation(operation as ITranslateOperation);
        } else if (operation.type === Object3D.createRotateOperation().type) {
          this.applyRotateOperation(operation as IRotateOperation);
        } else if (operation.type === Object3D.createScaleOperation().type) {
          this.applyScaleOperation(operation as IScaleOperation);
        } else {
          throw Error('ERROR: Unknown Operation');
        }
      });
    }

    this.pendingOperation = false;
  }

  private applyTranslateOperation(operation: ITranslateOperation): void {
    if (operation.relative) {
      this.mesh.translateX(operation.x);
      this.mesh.translateY(operation.y);
      this.mesh.translateZ(operation.z);
    } else {
      //absolute x,y,z axis.
      this.mesh.position.x += Number(operation.x);
      this.mesh.position.y += Number(operation.y);
      this.mesh.position.z += Number(operation.z);
    }
  }

  private applyRotateOperation(operation: IRotateOperation): void {
    const angle = THREE.Math.degToRad(Number(operation.angle));
    switch (operation.axis) {
      case 'x':
        if (operation.relative) {
          this.mesh.rotateX(angle);
        } else {
          this.mesh.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), angle);
        }
        break;

      case 'y':
        if (operation.relative) {
          this.mesh.rotateY(angle);
        } else {
          this.mesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), angle);
        }
        break;

      case 'z':
        if (operation.relative) {
          this.mesh.rotateZ(angle);
        } else {
          this.mesh.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), angle);
        }
        break;

      default:
        throw new Error('Unexpected Rotation Axis');
    }
  }

  private applyScaleOperation(operation: IScaleOperation): void {
    if (
      Number(operation.x) > 0 &&
      Number(operation.y) > 0 &&
      Number(operation.z) > 0
    )
      this.mesh.scale.set(
        this.mesh.scale.x * Number(operation.x),
        this.mesh.scale.y * Number(operation.y),
        this.mesh.scale.z * Number(operation.z),
      );
  }
}
