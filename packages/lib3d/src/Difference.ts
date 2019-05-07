/*
 * File: Difference.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Bitbloq Repository: https://github.com/bitbloq
 * Bitbloq Team: https://github.com/orgs/Bitbloq/people
 * Copyright 2018 - 2019 BQ Educacion.
 */

import CompoundObject, { ChildrenArray } from "./CompoundObject";
import ObjectsCommon from "./ObjectsCommon";
import Scene from "./Scene";
import * as THREE from "three";
import {
  ICompoundObjectJSON,
  IViewOptions,
  OperationsArray
} from "./Interfaces";

export default class Difference extends CompoundObject {
  public static typeName: string = "Difference";

  public static newFromJSON(
    object: ICompoundObjectJSON,
    scene: Scene
  ): Difference {
    if (object.type !== Difference.typeName) {
      throw new Error("Not Union Object");
    }

    try {
      const children: ChildrenArray = object.children.map(obj =>
        scene.getObject(obj)
      );

      // get the color of first children
      object.viewOptions.color = object.children[0].viewOptions.color;

      const viewOptions: Partial<IViewOptions> = {
        ...ObjectsCommon.createViewOptions(),
        ...object.children[0].viewOptions,
        ...object.viewOptions
      };
      let dif: Difference;

      // if geometry is in JSON, construct mesh from JSON (to avoid recomputing)
      // if geometry is in JSON, construct mesh from JSON (to avoid recomputing)

      if (object.geometry) {
        if (object.geometry.id !== object.id) {
          throw new Error("geometry and object id do not match");
        }
        const vertices: number[] = object.geometry.vertices;
        const normals: number[] = object.geometry.normals;
        const geometry: THREE.Geometry = ObjectsCommon.geometryFromVerticesNormals(
          vertices,
          normals
        );
        const mesh: THREE.Mesh = new THREE.Mesh(
          geometry,
          new THREE.MeshLambertMaterial()
        );
        mesh.userData.vertices = vertices;
        mesh.userData.normals = normals;

        dif = new Difference(
          children,
          object.operations,
          viewOptions,
          mesh,
          true
        );
      } else {
        dif = new Difference(children, object.operations, viewOptions);
      }
      dif.id = object.id || dif.id;
      return dif;
    } catch (e) {
      throw new Error(`Cannot create ObjectsGroup. ${e}`);
    }
  }

  constructor(
    children: ChildrenArray = [],
    operations: OperationsArray = [],
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    mesh?: THREE.Mesh | undefined,
    applyOperations: boolean = false
  ) {
    const vO: IViewOptions = {
      ...ObjectsCommon.createViewOptions(),
      ...children[0].toJSON().viewOptions,
      ...viewOptions
    };
    super(children, operations, vO);
    this.type = Difference.typeName;
    if (mesh) {
      this.setMesh(mesh);
      if (applyOperations) {
        this.pendingOperation = true;
        this.viewOptionsUpdateRequired = true;
        this.meshPromise = this.computeMeshAsync();
      }
    } else {
      this.meshPromise = this.computeMeshAsync();
    }
  }

  public clone(): Difference {
    const childrenClone: ChildrenArray = this.children.map(child =>
      child.clone()
    );

    if (this.mesh && !(this.meshUpdateRequired || this.pendingOperation)) {
      const diffObj = new Difference(
        childrenClone,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone()
      );
      return diffObj;
    }
    const obj = new Difference(
      childrenClone,
      this.operations,
      this.viewOptions
    );

    obj.verticesArray = this.verticesArray;
    obj.normalsArray = this.normalsArray;

    return obj;
  }
}
