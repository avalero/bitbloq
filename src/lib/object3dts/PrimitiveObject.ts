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
 * Created at     : 2018-11-16 17:30:44
 * Last modified  : 2018-11-28 16:46:13
 */

import isEqual from 'lodash.isequal';
import cloneDeep from 'lodash.clonedeep';
import Object3D from './Object3D';
import ObjectsCommon from './ObjectsCommon';
import {
  OperationsArray,
  IViewOptions,
  IObjectsCommonJSON,
} from './ObjectsCommon';
import * as THREE from 'three';
import CompoundObject from './CompoundObject';

export interface IPrimitiveObjectJSON extends IObjectsCommonJSON {
  parameters: object;
}

export default class PrimitiveObject extends Object3D {
  protected parameters: Object;

  constructor(
    viewOptions: IViewOptions = ObjectsCommon.createViewOptions(),
    operations: OperationsArray = [],
  ) {
    super(viewOptions, operations);
  }

  protected setParameters(parameters: Object): void {
    if (!this.parameters) {
      this.parameters = Object.assign({}, parameters);
      this._meshUpdateRequired = true;
      return;
    }

    if (!isEqual(parameters, this.parameters)) {
      this.parameters = Object.assign({}, parameters);
      this._meshUpdateRequired = true;
    }
  }

  /**
   * For primitive objects. Cube, Cylinder, etc.
   * For CompoundObjects find function in CompoundObjects Class
   */
  public toJSON(): IPrimitiveObjectJSON {
    return cloneDeep({
      ...super.toJSON(),
      parameters: this.parameters,
    });
  }

  public updateFromJSON(object: IPrimitiveObjectJSON) {
    if (this.id !== object.id)
      throw new Error('Object id does not match with JSON id');

    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...object.viewOptions,
    };
    this.setParameters(object.parameters);
    this.setOperations(object.operations);
    this.setViewOptions(vO);

    // if anything has changed, recompute mesh
    if (!isEqual(this.lastJSON, this.toJSON())) {
      this.lastJSON = this.toJSON();
      this.meshPromise = this.computeMeshAsync();
      let obj: ObjectsCommon | undefined = this.getParent();
      while (obj) {
        obj.meshUpdateRequired = true;
        obj.computeMeshAsync();
        obj = obj.getParent();
      }
    }
  }

  public async getMeshAsync(): Promise<THREE.Mesh> {
    if (this.meshPromise) {
      this.mesh = await this.meshPromise;
      this.meshPromise = null;
      return this.mesh;
    } else {
      return this.mesh;
    }
  }

  public async computeMeshAsync(): Promise<THREE.Mesh> {
    this.meshPromise = new Promise(async (resolve, reject) => {
      if (this.meshUpdateRequired) {
        const geometry: THREE.Geometry = this.getGeometry();
        this.mesh = new THREE.Mesh(geometry, this.getMaterial());
        this._meshUpdateRequired = false;
        await this.applyOperationsAsync();
      }

      if (this.pendingOperation) {
        await this.applyOperationsAsync();
      }

      if (this.viewOptionsUpdateRequired) {
        this.mesh.material = this.getMaterial();
        this._viewOptionsUpdateRequired = false;
      }

      if (this.mesh instanceof THREE.Mesh) resolve(this.mesh);
      else reject(new Error('Mesh has not been computed properly'));
    });
    return this.meshPromise;
  }
}
