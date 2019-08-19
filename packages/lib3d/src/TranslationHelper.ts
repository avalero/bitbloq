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
 * Created at     : 2018-10-17 12:30:31
 * Last modified  : 2018-12-16 19:55:28
 */

import * as THREE from 'three';
import ObjectsCommon from './ObjectsCommon';
import PositionCalculator from './PositionCalculator';
import RepetitionObject from './RepetitionObject';
import CompoundObject from './CompoundObject';
import ObjectsGroup from './ObjectsGroup';

export default class TranslationHelper {
  private helperMesh: THREE.Group;
  private obj: ObjectsCommon;
  private axis: string;
  private relative: boolean;

  constructor(obj: ObjectsCommon, axis: string, relative: boolean) {
    this.obj = obj;
    this.axis = axis;
    this.relative = relative;
    this.helperMesh = new THREE.Group();
  }

  public async getHelperMeshAsync(): Promise<THREE.Group> {
    this.helperMesh = new THREE.Group();

    if (this.obj instanceof ObjectsGroup) {
      return this.getHelperMeshObjectsGroupAsync();
    }

    const parent = this.obj.getParent();
    if (parent instanceof RepetitionObject) {
      this.helperMesh = await new TranslationHelper(
        parent,
        this.axis,
        true
      ).getHelperMeshAsync();
      return this.helperMesh;
    }

    if (parent instanceof ObjectsGroup) {
      this.helperMesh = await new TranslationHelper(
        this.obj.userData.objectClone,
        this.axis,
        this.relative
      ).getHelperMeshAsync();
      return this.helperMesh;
    }

    const mesh = await this.obj.getMeshAsync();
    this.helperMesh = this.buildHelper(mesh as THREE.Mesh);
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
    if (this.axis === 'y') {
      this.helperMesh.rotateZ(Math.PI / 2);
    }
    if (this.axis === 'z') {
      this.helperMesh.rotateY(-Math.PI / 2);
      this.helperMesh.rotateX(Math.PI / 2);
    }

    return this.helperMesh;
  }

  private async getHelperMeshObjectsGroupAsync(): Promise<THREE.Group> {
    const obj = this.obj as ObjectsGroup;
    const children = obj.getChildren();

    const childrenHelpers: THREE.Group[] = await Promise.all(
      children.map(child => {
        const helper = new TranslationHelper(
          child.userData.objectClone,
          this.axis,
          this.relative
        );
        return helper.getHelperMeshAsync();
      })
    );
    childrenHelpers.forEach(childHelper => this.helperMesh.add(childHelper));

    return this.helperMesh;
  }

  private buildHelper(mesh: THREE.Mesh) {
    const boundingBoxDims: THREE.Vector3 = new THREE.Vector3();
    new THREE.Box3().setFromObject(mesh).getSize(boundingBoxDims);
    const radius: number = 0.3;
    let color: number;
    const separation: number = 3;
    const length: number = 20;
    const arrowLength: number = 5;
    let offset: number;
    let offsetArrow: number;

    if (this.axis === 'x') {
      color = 0xff0000;
      offset = boundingBoxDims.x / 2 + separation + length / 2;
      offsetArrow =
        boundingBoxDims.x / 2 + separation + arrowLength / 2 + length;
    } else if (this.axis === 'y') {
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
      depthWrite: false,
    });

    this.helperMesh.add(new THREE.Mesh(cylinderGeometry, material));
    this.helperMesh.add(new THREE.Mesh(arrowGeometry, material));

    return this.helperMesh;
  }
}
