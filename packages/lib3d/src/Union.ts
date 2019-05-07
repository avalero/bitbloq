/*
 * File: Union.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Bitbloq Repository: https://github.com/bitbloq
 * Bitbloq Team: https://github.com/orgs/Bitbloq/people
 * Copyright 2018 - 2019 BQ Educacion.
 */

import CompoundObject, { ChildrenArray } from "./CompoundObject";
import ObjectsCommon from "./ObjectsCommon";
import * as THREE from "three";

import {
  ICompoundObjectJSON,
  IViewOptions,
  OperationsArray
} from "./Interfaces";
import Scene from "./Scene";

export default class Union extends CompoundObject {
  public static typeName: string = "Union";

  public static newFromJSON(object: ICompoundObjectJSON, scene: Scene): Union {
    if (object.type !== Union.typeName) {
      throw new Error("Not Union Object");
    }
    try {
      const children: ChildrenArray = object.children.map(objJSON =>
        scene.getObject(objJSON)
      );

      // get the color of first children
      object.viewOptions.color = object.children[0].viewOptions.color;

      const viewOptions: Partial<IViewOptions> = {
        ...ObjectsCommon.createViewOptions(),
        ...object.children[0].viewOptions,
        ...object.viewOptions
      };

      let union: Union;

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
        union = new Union(children, object.operations, viewOptions, mesh, true);
      } else {
        union = new Union(children, object.operations, viewOptions);
      }

      union.id = object.id || union.id;
      return union;
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
    this.type = Union.typeName;

    if (mesh) {
      this.setMesh(mesh);

      if (applyOperations) {
        // we have a mesh withoug operations and viewoptions
        this.pendingOperation = true;
        this.viewOptionsUpdateRequired = true;
        this.meshPromise = this.computeMeshAsync();
      }
    } else {
      this.meshPromise = this.computeMeshAsync();
    }
  }

  public clone(): Union {
    const childrenClone: ChildrenArray = this.children.map(child =>
      child.clone()
    );

    if (this.mesh && !(this.meshUpdateRequired || this.pendingOperation)) {
      const unionObj = new Union(
        childrenClone,
        this.operations,
        this.viewOptions,
        this.mesh.clone() as THREE.Mesh
      );
      unionObj.verticesArray = this.verticesArray;
      unionObj.normalsArray = this.normalsArray;

      return unionObj;
    }

    const obj = new Union(childrenClone, this.operations, this.viewOptions);
    return obj;
  }
}
