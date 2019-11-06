/*
 * File: PositionCalculator.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Bitbloq Repository: https://github.com/bitbloq
 * Bitbloq Team: https://github.com/orgs/Bitbloq/people
 * Copyright 2018 - 2019 BQ Educacion.
 */

import * as THREE from "three";
import ObjectsCommon from "./ObjectsCommon";
import { IObjectPosition } from "./Scene";

export default class PositionCalculator {
  private object: ObjectsCommon;
  private position: IObjectPosition;
  private matrix: THREE.Matrix4;

  constructor(object: ObjectsCommon) {
    this.object = object;
  }

  public getLocalPosition(): IObjectPosition {
    try {
      const obj = this.object;
      const mesh: THREE.Mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
      MeshOperations.applyOperations(mesh, obj.getOperations());

      const position = {
        x: mesh!.position.x,
        y: mesh!.position.y,
        z: mesh!.position.z
      };
      const angle = {
        x: (mesh!.rotation.x * 180.0) / Math.PI,
        y: (mesh!.rotation.y * 180.0) / Math.PI,
        z: (mesh!.rotation.z * 180.0) / Math.PI
      };

      if (Math.abs(angle.x - Math.trunc(angle.x)) < 0.01) {
        angle.x = Math.trunc(angle.x);
      }
      if (Math.abs(angle.y - Math.trunc(angle.y)) < 0.01) {
        angle.y = Math.trunc(angle.y);
      }
      if (Math.abs(angle.z - Math.trunc(angle.z)) < 0.01) {
        angle.z = Math.trunc(angle.z);
      }

      const scale = {
        x: mesh!.scale.x,
        y: mesh!.scale.x,
        z: mesh!.scale.x
      };
      return { position, angle, scale };
    } catch (e) {
      throw new Error(`Cannot find object: ${e}`);
    }
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
        z: (euler.z * 180) / Math.PI
      },
      scale: {
        x: scale.x,
        y: scale.y,
        z: scale.z
      }
    };

    return this.position;
  }

  public getMatrix(): THREE.Matrix4 {
    return this.matrix;
  }

  public async computeMatrixAsync(): Promise<THREE.Matrix4> {
    const obj = this.object;
    const parent = obj.getParent();

    // ObjectGroups are always at 0,0,0 (they do not have coordinates as a system)
    if (obj instanceof ObjectsGroup) {
      this.matrix = new THREE.Matrix4();
      return this.matrix;
    }

    // If object has a parent, get mesh (prior to computing), else, get computed mesh
    let mesh = parent ? await obj.getMeshAsync() : (obj as any).mesh;

    if (!mesh) {
      mesh = await obj.getMeshAsync();
    }

    (mesh as THREE.Mesh).updateMatrix();
    let myMatrix = (mesh as THREE.Mesh).matrix.clone();

    // if obj is Repetition Object we must compose with originalObject matrix
    if (obj instanceof RepetitionObject) {
      let groupMesh: THREE.Object3D = await obj.getMeshAsync();
      while (groupMesh instanceof THREE.Group) {
        const wOriMatrix = groupMesh.children[0].matrix.clone();
        myMatrix = myMatrix.multiply(wOriMatrix);
        groupMesh = groupMesh.children[0];
      }

      this.matrix = myMatrix;
    }

    if (!parent) {
      // Simple Mesh
      if (mesh instanceof THREE.Mesh) {
        this.matrix = myMatrix;
        return this.matrix;
      }

      if (obj instanceof RepetitionObject) {
        return this.matrix;
      }
    }

    // It has a parent
    const parentPosCalculator = new PositionCalculator(parent as ObjectsCommon);
    const parentMatrix = await parentPosCalculator.computeMatrixAsync();

    if (parent instanceof CompoundObject) {
      // if obj is the 1st children, its position is its parent position
      if (obj.getID() === parent.getChildren()[0].getID()) {
        this.matrix = parentMatrix;
        return this.matrix;
      }

      // object is not the primary object
      // primusMesh is not being recomputed just ask for mesh
      let primusObject = parent.getChildren()[0];

      // if primusObject is ObjectGroup, jump to its first child (as ObjectsGroups do not have position)
      while (
        primusObject instanceof ObjectsGroup ||
        primusObject instanceof RepetitionObject
      ) {
        if (primusObject instanceof ObjectsGroup) {
          primusObject = primusObject.getChildren()[0].userData.objectClone;
        }
        if (primusObject instanceof RepetitionObject) {
          primusObject = primusObject.getOriginal().userData.objectClone;
        }
      }

      const primusMesh = (primusObject as any).mesh;

      const primusMatrix = primusMesh.matrix;

      // remove the primus matrix operations to my matrix
      myMatrix.premultiply(new THREE.Matrix4().getInverse(primusMatrix));

      // compose parent position with my position
      this.matrix = parentPosCalculator.matrix.multiply(myMatrix);

      return this.matrix;
    }

    if (parent instanceof RepetitionObject) {
      this.matrix = parentMatrix;
      return this.matrix;
    }

    // When object is part of a group, each mesh acts as individual object adding parent operations
    if (parent instanceof ObjectsGroup) {
      // children of ObjectsGroups are clones with al their operations on them
      const clone = obj.userData.objectClone;
      const cloneMatrix = (await clone.getMeshAsync()).matrix;
      this.matrix = cloneMatrix.multiply(parentMatrix);
      return this.matrix;
    }

    if (!this.matrix) {
      this.matrix = new THREE.Matrix4();
    }
    return this.matrix;
  }
}

import { MeshOperations } from "./Bitbloq";
import CompoundObject from "./CompoundObject";
import ObjectsGroup from "./ObjectsGroup";
import PrimitiveObject from "./PrimitiveObject";
import RepetitionObject from "./RepetitionObject";
