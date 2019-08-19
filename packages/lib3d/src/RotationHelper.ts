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
 * Created at     : 2018-10-17 12:30:09
 * Last modified  : 2018-12-16 19:55:16
 */

import * as THREE from 'three';
import ObjectsCommon from './ObjectsCommon';
import PositionCalculator from './PositionCalculator';

export default class RotationHelper {
  private helperMesh: THREE.Group;
  private obj: ObjectsCommon;
  private axis: string;
  private relative: boolean;

  constructor(obj: ObjectsCommon, axis: string, relative: boolean) {
    this.obj = obj;
    this.axis = axis;
    this.relative = relative;
  }

  public async getHelperMeshAsync(): Promise<THREE.Group> {
    const mesh = await this.obj.getMeshAsync();
    if (
      mesh instanceof THREE.Mesh ||
      (mesh.userData &&
        mesh.userData.type &&
        mesh.userData.type === 'RepetitionObject')
    ) {
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

      if (this.axis === 'x') {
        color = 0xff0000;
        toroidRadius =
          Math.max(boundingBoxDims.y, boundingBoxDims.z) / 2 + separation;
        length = Math.max(boundingBoxDims.y, boundingBoxDims.z) + extraLength;
      } else if (this.axis === 'y') {
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

      const cylinderGeometry = new THREE.CylinderGeometry(
        radius,
        radius,
        length
      );
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
        depthWrite: false,
      });

      this.helperMesh = new THREE.Group();
      this.helperMesh.add(new THREE.Mesh(cylinderGeometry, material));
      this.helperMesh.add(new THREE.Mesh(toroidGeometry, material));

      const position = await new PositionCalculator(
        this.obj
      ).getPositionAsync();

      this.helperMesh.position.set(
        position.position.x,
        position.position.y,
        position.position.z
      );

      if (this.relative) {
        this.helperMesh.setRotationFromEuler(
          new THREE.Euler(
            (Math.PI * position.angle.x) / 180.0,
            (Math.PI * position.angle.y) / 180.0,
            (Math.PI * position.angle.z) / 180.0
          )
        );
      }

      if (this.axis === 'y') {
        this.helperMesh.rotateZ(Math.PI / 2);
      }
      if (this.axis === 'z') {
        this.helperMesh.rotateY(-Math.PI / 2);
        this.helperMesh.rotateX(Math.PI / 2);
      }
    }
    // else if (mesh instanceof THREE.Group) {
    //   const groups: THREE.Group[] = mesh.children.map(m => {
    //     const rotHelper: RotationHelper = new RotationHelper(m, axis, relative);
    //     return rotHelper.mesh;
    //   });

    //   this.helperMesh = new THREE.Group();

    //   this.helperMesh.children = groups.flatMap(group =>
    //     group.children.map(child => {
    //       child.position.copy(group.position);
    //       child.setRotationFromEuler(group.rotation);
    //       return child;
    //     })
    //   );
    // }

    return this.helperMesh;
  }
}
