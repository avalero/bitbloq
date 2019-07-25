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

export default class RotationHelper {
  private helperMesh: THREE.Group;

  constructor(mesh: THREE.Object3D, axis: string, relative: boolean) {
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

      if (axis === 'x') {
        color = 0xff0000;
        toroidRadius =
          Math.max(boundingBoxDims.y, boundingBoxDims.z) / 2 + separation;
        length = Math.max(boundingBoxDims.y, boundingBoxDims.z) + extraLength;
      } else if (axis === 'y') {
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

      this.helperMesh.position.copy(mesh.position);

      if (relative) {
        this.helperMesh.setRotationFromEuler(mesh.rotation);
      }

      if (axis === 'y') {
        this.helperMesh.rotateZ(Math.PI / 2);
      }
      if (axis === 'z') {
        this.helperMesh.rotateY(-Math.PI / 2);
        this.helperMesh.rotateX(Math.PI / 2);
      }
    } else if (mesh instanceof THREE.Group) {
      // debugger;
      const groups: THREE.Group[] = mesh.children.map(m => {
        const rotHelper: RotationHelper = new RotationHelper(m, axis, relative);
        return rotHelper.mesh;
      });

      this.helperMesh = new THREE.Group();

      this.helperMesh.children = groups.flatMap(group =>
        group.children.map(child => {
          child.position.copy(group.position);
          child.setRotationFromEuler(group.rotation);
          return child;
        })
      );
    }
  }

  get mesh(): THREE.Group {
    return this.helperMesh;
  }
}
