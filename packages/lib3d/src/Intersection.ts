/*
 * File: Intersection.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Bitbloq Repository: https://github.com/bitbloq
 * Bitbloq Team: https://github.com/orgs/Bitbloq/people
 * Copyright 2018 - 2019 BQ Educacion.
 */

import {
  ICompoundObjectJSON,
  IViewOptions,
  OperationsArray
} from "./Interfaces";
import * as THREE from "three";
import CompoundObject, { ChildrenArray } from "./CompoundObject";
import ObjectsCommon from "./ObjectsCommon";
import Scene from "./Scene";

export default class Intersection extends CompoundObject {
  public static typeName: string = "Intersection";

  public static newFromJSON(
    object: ICompoundObjectJSON,
    scene: Scene
  ): Intersection {
    if (object.type !== Intersection.typeName) {
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
      let intersect: Intersection;

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

        intersect = new Intersection(
          children,
          object.operations,
          viewOptions,
          mesh,
          true
        );
      } else {
        intersect = new Intersection(children, object.operations, viewOptions);
      }
      intersect.id = object.id || intersect.id;
      return intersect;
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
    this.type = Intersection.typeName;

    if (mesh) {
      this.setMesh(mesh);
      // we have a mesh withoug operations and viewoptions
      if (applyOperations) {
        this.pendingOperation = true;
        this.viewOptionsUpdateRequired = true;
        this.meshPromise = this.computeMeshAsync();
      }
    } else {
      this.meshPromise = this.computeMeshAsync();
    }
  }

  public clone(): Intersection {
    const childrenClone: ChildrenArray = this.children.map(child =>
      child.clone()
    );
    if (this.mesh && !(this.meshUpdateRequired || this.pendingOperation)) {
      const intObj = new Intersection(
        childrenClone,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone()
      );

      intObj.verticesArray = this.verticesArray;
      intObj.normalsArray = this.normalsArray;

      return intObj;
    }
    const obj = new Intersection(
      childrenClone,
      this.operations,
      this.viewOptions
    );
    return obj;
  }
}
