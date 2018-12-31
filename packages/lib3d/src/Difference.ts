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
 * Created at     : 2018-10-16 13:00:00
 * Last modified  : 2018-12-28 19:21:00
 */

import isEqual from "lodash.isequal";
import CompoundObject, {
  ChildrenArray,
  ICompoundObjectJSON
} from "./CompoundObject";
import Object3D from "./Object3D";
import ObjectsCommon, { IViewOptions, OperationsArray } from "./ObjectsCommon";
import Scene from "./Scene";
import RepetitionObject from "./RepetitionObject";
import ObjectsGroup from "./ObjectsGroup";

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
      const viewOptions: Partial<IViewOptions> = {
        ...ObjectsCommon.createViewOptions(),
        ...object.children[0].viewOptions,
        ...object.viewOptions
      };
      return new Difference(children, object.operations, viewOptions);
    } catch (e) {
      throw new Error(`Cannot create ObjectsGroup. ${e}`);
    }
  }

  constructor(
    children: ChildrenArray = [],
    operations: OperationsArray = [],
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    mesh?: THREE.Mesh | undefined
  ) {
    const vO: IViewOptions = {
      ...ObjectsCommon.createViewOptions(),
      ...children[0].toJSON().viewOptions,
      ...viewOptions
    };
    super(children, operations, vO);
    this.type = Difference.typeName;
    this.lastJSON = this.toJSON();
    if (mesh) {
      this.setMesh(mesh);
    } else {
      this.meshPromise = this.computeMeshAsync();
    }
  }

  public clone(): Difference {
    const childrenClone: ChildrenArray = this.children.map(child =>
      child.clone()
    );

    if (isEqual(this.lastJSON, this.toJSON())) {
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
    return obj;
  }
}
