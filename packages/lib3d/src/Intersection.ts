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
 * Created at     : 2018-10-16 12:59:53
 * Last modified  : 2019-01-31 10:35:43
 */

import {
  ICompoundObjectJSON,
  IViewOptions,
  OperationsArray,
} from './Interfaces';
import * as THREE from 'three';
import CompoundObject, { ChildrenArray } from './CompoundObject';
import ObjectsCommon from './ObjectsCommon';
import Scene from './Scene';

export default class Intersection extends CompoundObject {
  public static typeName: string = 'Intersection';

  public static newFromJSON(
    object: ICompoundObjectJSON,
    scene: Scene,
  ): Intersection {
    if (object.type !== Intersection.typeName) {
      throw new Error('Not Union Object');
    }

    try {
      const children: ChildrenArray = object.children.map(obj =>
        scene.getObject(obj),
      );
      const viewOptions: Partial<IViewOptions> = {
        ...ObjectsCommon.createViewOptions(),
        ...object.children[0].viewOptions,
        ...object.viewOptions,
      };
      let intersect: Intersection;

      // if geometry is in JSON, construct mesh from JSON (to avoid recomputing)
      if (object.geometry) {
        const vertices: number[] = object.geometry.vertices;
        const normals: number[] = object.geometry.normals;
        const geometry: THREE.Geometry = ObjectsCommon.geometryFromVerticesNormals(
          vertices,
          normals,
        );
        const mesh: THREE.Mesh = new THREE.Mesh(
          geometry,
          new THREE.MeshLambertMaterial(),
        );
        intersect = new Intersection(
          children,
          object.operations,
          viewOptions,
          mesh,
          true,
        );
        intersect.verticesArray = vertices;
        intersect.normalsArray = normals;
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
    applyOperations: boolean = false,
  ) {
    const vO: IViewOptions = {
      ...ObjectsCommon.createViewOptions(),
      ...children[0].toJSON().viewOptions,
      ...viewOptions,
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
      child.clone(),
    );
    if (
      this.mesh &&
      !(
        this.meshUpdateRequired ||
        this.pendingOperation ||
        this.viewOptionsUpdateRequired
      )
    ) {
      const intObj = new Intersection(
        childrenClone,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone(),
      );

      intObj.verticesArray = this.verticesArray;
      intObj.normalsArray = this.normalsArray;

      return intObj;
    }
    const obj = new Intersection(
      childrenClone,
      this.operations,
      this.viewOptions,
    );
    return obj;
  }
}
