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
 * Last modified  : 2019-01-29 17:34:38
 */

import { isEqual, cloneDeep } from 'lodash';
import Object3D from './Object3D';
import ObjectsCommon, {
  IObjectsCommonJSON,
  IViewOptions,
  OperationsArray,
} from './ObjectsCommon';
import ObjectsGroup from './ObjectsGroup';
import RepetitionObject from './RepetitionObject';
import * as THREE from 'three';

export interface IPrimitiveObjectJSON extends IObjectsCommonJSON {
  parameters: object;
}

export default class PrimitiveObject extends Object3D {
  protected parameters: object;

  constructor(viewOptions: IViewOptions, operations: OperationsArray) {
    super(viewOptions, operations);
  }

  public toJSON(): IPrimitiveObjectJSON {
    // return cloneDeep({
    //   ...super.toJSON(),
    //   parameters: this.parameters,
    // });

    return {
      ...super.toJSON(),
      parameters: this.parameters,
    };
  }

  /**
   * For primitive objects. Cube, Cylinder, etc.
   * For CompoundObjects find function in CompoundObjects Class
   */

  public updateFromJSON(
    object: IPrimitiveObjectJSON,
    fromParent: boolean = false,
  ) {

    if (this.id !== object.id) {
      throw new Error('Object id does not match with JSON id');
    }

    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...object.viewOptions,
    };
    this.setParameters(object.parameters);
    this.setOperations(object.operations);
    this.setViewOptions(vO);

    // if has no parent, update mesh, else update through parent
    const obj: ObjectsCommon | undefined = this.getParent();
    if (obj && !fromParent) {
      obj.updateFromJSON(obj.toJSON());
    } else {
      if (
        this.meshUpdateRequired ||
        this.pendingOperation ||
        this.viewOptionsUpdateRequired
      ) {
        this.meshPromise = this.computeMeshAsync();
      }
    }
  }

  public async computeMeshAsync(): Promise<THREE.Mesh> {
    this.meshPromise = new Promise(async (resolve, reject) => {
      try {
        if (this.meshUpdateRequired) {
          const geometry: THREE.Geometry = this.getGeometry();
          this.mesh = new THREE.Mesh(geometry);
          this.meshUpdateRequired = false;

          this.applyViewOptions();
          await this.applyOperationsAsync();
        }

        if (this.pendingOperation) {
          await this.applyOperationsAsync();
        }

        if (this.viewOptionsUpdateRequired) {
          this.applyViewOptions();
        }
        resolve(this.mesh);
      } catch (e) {
        reject(e);
        throw new Error(`Cannot compute Mesh: ${e}`);
      }
    });

    return this.meshPromise as Promise<THREE.Mesh>;
  }

  protected setParameters(parameters: object): void {
    if (!this.parameters) {
      this.parameters = { ...parameters };
      this.meshUpdateRequired = true;
      return;
    }

    if (!isEqual(parameters, this.parameters)) {
      this.parameters = { ...parameters };
      this.meshUpdateRequired = true;
      return;
    }
  }
}
