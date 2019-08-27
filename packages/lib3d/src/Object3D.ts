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
 * Last modified  : 2019-01-31 10:36:23
 */

import * as THREE from "three";
import ObjectsCommon from "./ObjectsCommon";

import {
  IMirrorOperation,
  IRotateOperation,
  IScaleOperation,
  ITranslateOperation,
  IViewOptions,
  OperationsArray,
  IObjectsCommonJSON,
  IGeometry
} from "./Interfaces";

export default class Object3D extends ObjectsCommon {
  public static getVerticesFromGeom(
    geometry: THREE.Geometry
  ): ArrayLike<number> {
    const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
    const attribute = bufferGeometry.getAttribute("position");

    return attribute.array;
  }

  public static getNormalsFromGeom(
    geometry: THREE.Geometry
  ): ArrayLike<number> {
    const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
    const attribute = bufferGeometry.getAttribute("normal");

    return attribute.array;
  }

  public static getMeshFromVerticesNormals(
    vertices: ArrayLike<number>,
    normals: ArrayLike<number>,
    material: THREE.MeshLambertMaterial
  ): THREE.Mesh {
    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.addAttribute("normal", new THREE.BufferAttribute(normals, 3));
    const mesh: THREE.Mesh = new THREE.Mesh(geometry, material);

    return mesh;
  }

  protected normalsArray: number[];
  protected verticesArray: number[];

  constructor(
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    operations: OperationsArray = []
  ) {
    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...viewOptions
    };
    super(vO, operations);
  }

  public async applyOperationsAsync(): Promise<void> {
    this.mesh.position.set(0, 0, 0);
    this.mesh.quaternion.setFromEuler(new THREE.Euler(0, 0, 0), true);

    this.mesh.scale.x = 1;
    this.mesh.scale.y = 1;
    this.mesh.scale.z = 1;

    this.operations.forEach(operation => {
      // Translate operation
      if (operation.type === Object3D.createTranslateOperation().type) {
        this.applyTranslateOperation(operation as ITranslateOperation);
      } else if (operation.type === Object3D.createRotateOperation().type) {
        this.applyRotateOperation(operation as IRotateOperation);
      } else if (operation.type === Object3D.createScaleOperation().type) {
        this.applyScaleOperation(operation as IScaleOperation);
      } else if (operation.type === Object3D.createMirrorOperation().type) {
        this.applyMirrorOperation(operation as IMirrorOperation);
      } else {
        throw Error("ERROR: Unknown Operation");
      }
    });

    this.pendingOperation = false;

    this.mesh.updateMatrixWorld(true);
    this.mesh.updateMatrix();

    return;
  }

  public clone(): any {
    throw new Error("Object3D.clone() Implemented in children");
  }

  public getGeometryData(): IGeometry {
    return {
      id: this.id,
      vertices: this.verticesArray,
      normals: this.normalsArray
    };
  }

  protected applyOperations(): void {
    this.mesh.position.set(0, 0, 0);
    this.mesh.quaternion.setFromEuler(new THREE.Euler(0, 0, 0), true);

    this.mesh.scale.x = 1;
    this.mesh.scale.y = 1;
    this.mesh.scale.z = 1;

    this.operations.forEach(operation => {
      // Translate operation
      if (operation.type === Object3D.createTranslateOperation().type) {
        this.applyTranslateOperation(operation as ITranslateOperation);
      } else if (operation.type === Object3D.createRotateOperation().type) {
        this.applyRotateOperation(operation as IRotateOperation);
      } else if (operation.type === Object3D.createScaleOperation().type) {
        this.applyScaleOperation(operation as IScaleOperation);
      } else if (operation.type === Object3D.createMirrorOperation().type) {
        this.applyMirrorOperation(operation as IMirrorOperation);
      } else {
        throw Error("ERROR: Unknown Operation");
      }
    });

    this.pendingOperation = false;

    this.mesh.updateMatrixWorld(true);
    this.mesh.updateMatrix();

    return;
  }

  protected getGeometry(): THREE.Geometry {
    throw new Error("ERROR. Pure Virtual Function implemented in children");
  }

  protected getBufferGeometry(): THREE.BufferGeometry {
    throw new Error("ERROR. Pure Virtual Function implemented in children");
  }

  protected applyViewOptions(mesh?: THREE.Mesh): void {
    if (!this.mesh && !mesh) {
      throw new Error("ApplyViewOptions - Mesh not defined");
    }

    let matParams: THREE.MeshLambertMaterialParameters = {
      color: this.viewOptions.color,
      transparent: false
    };

    if (this.viewOptions.opacity < 1) {
      matParams = {
        ...matParams,
        opacity: this.viewOptions.opacity,
        transparent: true
      };
    }
    const material: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial(
      matParams
    );

    if (mesh) {
      mesh.material = material;
    } else {
      (this.mesh as THREE.Mesh).material = material;
    }
    this._viewOptionsUpdateRequired = false;
  }

  protected applyMirrorOperation(operation: IMirrorOperation): void {
    if (operation.plane === "xy") {
      this.applyScaleOperation(Object3D.createScaleOperation(1, 1, -1));
    } else if (operation.plane === "yz") {
      this.applyScaleOperation(Object3D.createScaleOperation(-1, 1, 1));
    } else if (operation.plane === "zx") {
      this.applyScaleOperation(Object3D.createScaleOperation(1, -1, 1));
    }
  }

  protected applyTranslateOperation(operation: ITranslateOperation): void {
    if (operation.relative) {
      this.mesh.translateX(operation.x);
      this.mesh.translateY(operation.y);
      this.mesh.translateZ(operation.z);
    } else {
      // absolute x,y,z axis.
      this.mesh.position.x += Number(operation.x);
      this.mesh.position.y += Number(operation.y);
      this.mesh.position.z += Number(operation.z);
    }
  }

  protected applyRotateOperation(operation: IRotateOperation): void {
    const x = THREE.Math.degToRad(Number(operation.x));
    const y = THREE.Math.degToRad(Number(operation.y));
    const z = THREE.Math.degToRad(Number(operation.z));
    if (operation.relative) {
      this.mesh.rotateX(x);
      this.mesh.rotateY(y);
      this.mesh.rotateZ(z);
    } else {
      this.mesh.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), x);
      this.mesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), y);
      this.mesh.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), z);
    }
  }

  protected applyScaleOperation(operation: IScaleOperation): void {
    this.mesh.scale.set(
      this.mesh.scale.x * Number(operation.x),
      this.mesh.scale.y * Number(operation.y),
      this.mesh.scale.z * Number(operation.z)
    );
  }

  protected setMesh(mesh: THREE.Mesh): void {
    this.mesh = mesh;

    this.meshUpdateRequired = false;
    this.pendingOperation = false;
    this.viewOptionsUpdateRequired = false;

    if (mesh.userData.vertices && mesh.userData.normals) {
      this.verticesArray = mesh.userData.vertices;
      this.normalsArray = mesh.userData.normals;
    }

    this.mesh.updateMatrixWorld(true);
    this.mesh.updateMatrix();
  }
}
