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
 * Created at     : 2018-10-16 13:00:09
 * Last modified  : 2019-01-18 18:52:52
 */

import { isEqual } from 'lodash';
import CompoundObject, {
  ChildrenArray,
  ICompoundObjectJSON,
} from './CompoundObject';
import Object3D from './Object3D';
import ObjectsCommon, { IViewOptions, OperationsArray } from './ObjectsCommon';

import Scene from './Scene';

export default class Union extends CompoundObject {
  public static typeName: string = 'Union';

  public static newFromJSON(object: ICompoundObjectJSON, scene: Scene): Union {
    if (object.type !== Union.typeName) {
      throw new Error('Not Union Object');
    }
    try {
      const children: ChildrenArray = object.children.map(objJSON =>
        scene.getObject(objJSON),
      );

      const viewOptions: Partial<IViewOptions> = {
        ...ObjectsCommon.createViewOptions(),
        ...object.children[0].viewOptions,
        ...object.viewOptions,
      };
      const union = new Union(children, object.operations, viewOptions);
      union.id = object.id || '';
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
  ) {
    const vO: IViewOptions = {
      ...ObjectsCommon.createViewOptions(),
      ...children[0].toJSON().viewOptions,
      ...viewOptions,
    };
    super(children, operations, vO);
    this.type = Union.typeName;
    this.lastJSON = this.toJSON();
    if (mesh) {
      this.setMesh(mesh);
    } else {
      this.meshPromise = this.computeMeshAsync();
    }
  }

  public clone(): Union {
    const childrenClone: ChildrenArray = this.children.map(child =>
      child.clone(),
    );

    if (isEqual(this.lastJSON, this.toJSON())) {
      const unionObj = new Union(
        childrenClone,
        this.operations,
        this.viewOptions,
        this.mesh.clone() as THREE.Mesh,
      );
      return unionObj;
    }

    const obj = new Union(childrenClone, this.operations, this.viewOptions);
    return obj;
  }
}
