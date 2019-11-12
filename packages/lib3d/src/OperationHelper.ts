/*
 * File: OperationHelper.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Bitbloq Repository: https://github.com/bitbloq
 * Bitbloq Team: https://github.com/orgs/Bitbloq/people
 * Copyright 2018 - 2019 BQ Educacion.
 */

import * as THREE from "three";
import ObjectsCommon from "./ObjectsCommon";
import PositionCalculator from "./PositionCalculator";
import RepetitionObject from "./RepetitionObject";
import CompoundObject from "./CompoundObject";
import ObjectsGroup from "./ObjectsGroup";
import { OperationsArray } from "./Interfaces";
import DummyObject from "./DummyObject";

enum HelperType {
  Rotation = "rotation",
  Translation = "translation"
}

enum HelperAxis {
  X = "x",
  Y = "y",
  Z = "z"
}

export default class OperationHelper {
  private helperMesh: THREE.Group;
  private obj: ObjectsCommon;
  private axis: HelperAxis;
  private relative: boolean;
  private type: HelperType;
  private operationID: string;

  constructor(
    obj: ObjectsCommon,
    type: HelperType,
    axis: HelperAxis,
    relative: boolean,
    operationID: string
  ) {
    this.type = type;
    this.obj = obj;
    this.axis = axis;
    this.relative = relative;
    this.operationID = operationID;
    this.helperMesh = new THREE.Group();
  }

  public async getHelperMeshAsync(): Promise<THREE.Group> {
    this.helperMesh = new THREE.Group();

    if (this.obj instanceof ObjectsGroup) {
      return this.getHelperMeshObjectsGroupAsync();
    }

    const parent = this.obj.getParent();

    if (parent instanceof RepetitionObject) {
      this.helperMesh = await new OperationHelper(
        parent,
        this.type,
        this.axis,
        true,
        this.operationID
      ).getHelperMeshAsync();

      return this.helperMesh;
    }

    if (parent instanceof ObjectsGroup) {
      this.helperMesh = await new OperationHelper(
        this.obj.userData.objectClone as ObjectsCommon,
        this.type,
        this.axis,
        this.relative,
        this.operationID
      ).getHelperMeshAsync();

      return this.helperMesh;
    }

    const mesh = await this.obj.getMeshAsync();
    this.helperMesh =
      this.type === HelperType.Translation
        ? this.buildTranslationHelper(mesh as THREE.Mesh)
        : this.buildRotationHelper(mesh as THREE.Mesh);

    const positionCalculator = await new PositionCalculator(
      this.obj
    ).getPositionAsync();

    this.helperMesh.position.set(
      positionCalculator.position.x,
      positionCalculator.position.y,
      positionCalculator.position.z
    );

    if (this.relative) {
      this.helperMesh.setRotationFromEuler(
        new THREE.Euler(
          (Math.PI * positionCalculator.angle.x) / 180.0,
          (Math.PI * positionCalculator.angle.y) / 180.0,
          (Math.PI * positionCalculator.angle.z) / 180.0
        )
      );
    }

    if (!this.relative) {
      if (parent) {
        const matrixParent: THREE.Matrix4 = await new PositionCalculator(
          parent
        ).computeMatrixAsync();

        if (parent instanceof CompoundObject) {
          const children0 = parent.getChildren()[0];
          const children0Mesh = await children0.getMeshAsync();

          (children0Mesh as THREE.Mesh).updateMatrix();
          const children0Matrix = (children0Mesh as THREE.Mesh).matrix.clone();

          if (children0.getID() === this.obj.getID()) {
            // TODO
          } else {
            const position: THREE.Vector3 = new THREE.Vector3();
            const angleQuat: THREE.Quaternion = new THREE.Quaternion();
            const scale: THREE.Vector3 = new THREE.Vector3();

            matrixParent
              .multiply(new THREE.Matrix4().getInverse(children0Matrix))
              .decompose(position, angleQuat, scale);
            this.helperMesh.setRotationFromQuaternion(angleQuat);
          }
        }
      }
    }

    // rotate according to the axis
    if (this.axis === HelperAxis.Y) {
      this.helperMesh.rotateZ(Math.PI / 2);
    }
    if (this.axis === HelperAxis.Z) {
      this.helperMesh.rotateY(-Math.PI / 2);
      this.helperMesh.rotateX(Math.PI / 2);
    }

    if (this.relative) {
      this.helperMesh = await this.removeOperationsAsync(
        this.helperMesh,
        this.operationID,
        this.obj.getOperations()
      );
    }

    return this.helperMesh;
  }

  private async removeOperationsAsync(
    mesh: THREE.Group,
    operationID: string,
    operations: OperationsArray
  ): Promise<THREE.Group> {
    const afterOperations: OperationsArray = [];
    let found: boolean = false;

    // add operations that will be applied after operationID to afterOperations Array
    operations.forEach(op => {
      if (found) {
        afterOperations.push(op);
      }
      if (!found && op.id === operationID) {
        found = true;
      }
    });

    if (afterOperations.length === 0) {
      return mesh;
    }

    const dummyObj = new DummyObject();
    dummyObj.setOperations(afterOperations);
    await dummyObj.computeMeshAsync();
    const dummyMesh = await dummyObj.getMeshAsync();
    dummyMesh.updateMatrix();
    const afterMatrix: THREE.Matrix4 = dummyMesh.matrix.clone();
    const inverseAfterMatrix: THREE.Matrix4 = new THREE.Matrix4().getInverse(
      afterMatrix
    );

    mesh.updateMatrix();
    let meshMatrix = mesh.matrix.clone();
    meshMatrix = meshMatrix.premultiply(inverseAfterMatrix);
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    meshMatrix.decompose(position, quaternion, scale);

    // mesh.position.set(position.x, position.y, position.z);
    mesh.setRotationFromQuaternion(quaternion);
    mesh.scale.set(scale.x, scale.y, scale.z);

    return mesh;
  }

  private async getHelperMeshObjectsGroupAsync(): Promise<THREE.Group> {
    const obj = this.obj as ObjectsGroup;
    const children = obj.getChildren();

    const childrenHelpers: THREE.Group[] = await Promise.all(
      children.map(child => {
        const helper = new OperationHelper(
          child.userData.objectClone as ObjectsCommon,
          this.type,
          this.axis,
          this.relative,
          this.operationID
        );
        return helper.getHelperMeshAsync();
      })
    );
    childrenHelpers.forEach(childHelper => this.helperMesh.add(childHelper));

    return this.helperMesh;
  }

  private buildRotationHelper(mesh: THREE.Mesh): THREE.Group {
    const boundingBoxDims: THREE.Vector3 = new THREE.Vector3();
    new THREE.Box3().setFromObject(mesh).getSize(boundingBoxDims);
    const radius: number = 0.5;
    let color: number;
    const separation: number = 10;
    let length: number;
    const extraLength: number = 30;
    let toroidRadius: number;
    const toroidArc: number = 2 * Math.PI;
    const toroidInnerRadius: number = 0.7;

    if (this.axis === HelperAxis.X) {
      color = 0xff0000;
      toroidRadius =
        Math.max(boundingBoxDims.y, boundingBoxDims.z) / 2 + separation;
      length = Math.max(boundingBoxDims.y, boundingBoxDims.z) + extraLength;
    } else if (this.axis === HelperAxis.Y) {
      color = 0x00ff00;
      toroidRadius =
        Math.max(boundingBoxDims.x, boundingBoxDims.z) / 2 + separation;
      length = Math.max(boundingBoxDims.x, boundingBoxDims.z) + extraLength;
    } else {
      color = 0x0000ff;
      toroidRadius =
        Math.max(boundingBoxDims.x, boundingBoxDims.y) / 2 + separation;
      length = Math.max(boundingBoxDims.x, boundingBoxDims.y) + extraLength;
    }

    const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, length);
    cylinderGeometry.rotateZ(Math.PI / 2);

    const toroidGeometry = new THREE.TorusGeometry(
      toroidRadius,
      toroidInnerRadius,
      6,
      toroidRadius * 2, // lets make number of segments equal to radius * factor
      toroidArc
    );

    toroidGeometry.rotateY(Math.PI / 2);

    const material = new THREE.MeshBasicMaterial({
      color,
      opacity: 0.5,
      transparent: true,
      depthWrite: false
    });

    this.helperMesh = new THREE.Group();
    this.helperMesh.add(new THREE.Mesh(cylinderGeometry, material));
    this.helperMesh.add(new THREE.Mesh(toroidGeometry, material));

    return this.helperMesh;
  }

  private buildTranslationHelper(mesh: THREE.Mesh) {
    const boundingBoxDims: THREE.Vector3 = new THREE.Vector3();
    new THREE.Box3().setFromObject(mesh).getSize(boundingBoxDims);
    const radius: number = 0.3;
    let color: number;
    const separation: number = 3;
    const length: number = 20;
    const arrowLength: number = 5;
    let offset: number;
    let offsetArrow: number;

    if (this.axis === HelperAxis.X) {
      color = 0xff0000;
      offset = boundingBoxDims.x / 2 + separation + length / 2;
      offsetArrow =
        boundingBoxDims.x / 2 + separation + arrowLength / 2 + length;
    } else if (this.axis === HelperAxis.Y) {
      color = 0x00ff00;
      offset = boundingBoxDims.y / 2 + separation + length / 2;
      offsetArrow =
        boundingBoxDims.y / 2 + separation + arrowLength / 2 + length;
    } else {
      color = 0x0000ff;
      offset = boundingBoxDims.z / 2 + separation + length / 2;
      offsetArrow =
        boundingBoxDims.z / 2 + separation + arrowLength / 2 + length;
    }

    const cylinderGeometry: THREE.Geometry = new THREE.CylinderGeometry(
      radius,
      radius,
      length
    );
    cylinderGeometry.rotateZ(Math.PI / 2);
    cylinderGeometry.translate(offset, 0, 0);

    const arrowGeometry: THREE.Geometry = new THREE.CylinderGeometry(
      2 * radius,
      0,
      5,
      20
    );
    arrowGeometry.rotateZ(Math.PI / 2);
    arrowGeometry.translate(offsetArrow, 0, 0);

    const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
      color,
      opacity: 0.5,
      transparent: true,
      depthWrite: false
    });

    this.helperMesh.add(new THREE.Mesh(cylinderGeometry, material));
    this.helperMesh.add(new THREE.Mesh(arrowGeometry, material));

    return this.helperMesh;
  }
}
