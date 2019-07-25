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

export default class TranslationHelper {
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
      const radius: number = 0.3;
      let color: number;
      const separation: number = 3;
      const length: number = 20;
      const arrowLength: number = 5;
      let offset: number;
      let offsetArrow: number;

      if (axis === 'x') {
        color = 0xff0000;
        offset = boundingBoxDims.x / 2 + separation + length / 2;
        offsetArrow =
          boundingBoxDims.x / 2 + separation + arrowLength / 2 + length;
      } else if (axis === 'y') {
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

      this.helperMesh = new THREE.Group();
      this.helperMesh.add(new THREE.Mesh(cylinderGeometry, material));
      this.helperMesh.add(new THREE.Mesh(arrowGeometry, material));

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
        const transHelper: TranslationHelper = new TranslationHelper(
          m,
          axis,
          relative
        );
        return transHelper.mesh;
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
