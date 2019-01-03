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
 * Created at     : 2018-11-09 09:31:03
 * Last modified  : 2018-12-28 19:49:39
 */

import Object3D from "./Object3D";
import ObjectsCommon, {
  IMirrorOperation,
  IObjectsCommonJSON,
  IRotateOperation,
  IScaleOperation,
  ITranslateOperation,
  IViewOptions,
  OperationsArray
} from "./ObjectsCommon";

import cloneDeep from "lodash.clonedeep";
import isEqual from "lodash.isequal";
import * as THREE from "three";

import CompoundWorker from "./compound.worker";

export interface ICompoundObjectJSON extends IObjectsCommonJSON {
  children: IObjectsCommonJSON[];
}

export type ChildrenArray = ObjectsCommon[];

export default class CompoundObject extends Object3D {
  get meshUpdateRequired(): boolean {
    this.children.forEach(child => {
      this._meshUpdateRequired =
        this._meshUpdateRequired ||
        child.meshUpdateRequired ||
        child.pendingOperation;
    });

    return this._meshUpdateRequired;
  }

  set meshUpdateRequired(a: boolean) {
    this._meshUpdateRequired = a;
  }

  get pendingOperation(): boolean {
    this.children.forEach(child => {
      this._pendingOperation = this._pendingOperation || child.pendingOperation;
    });

    return this._pendingOperation;
  }

  set pendingOperation(a: boolean) {
    this._pendingOperation = a;
  }
  protected children: ChildrenArray;
  protected worker: CompoundWorker | null;

  constructor(
    children: ChildrenArray = [],
    operations: OperationsArray = [],
    viewOptions: IViewOptions = ObjectsCommon.createViewOptions()
  ) {
    super(viewOptions, operations);
    if (children.length === 0) {
      throw new Error("Compound Object requires at least one children");
    }
    this.children = children;

    // children will have this CompoundObject as Parent
    this.children.forEach(child => child.setParent(this));
    this._meshUpdateRequired = true;
  }

  public getChildren(): ChildrenArray {
    return this.children;
  }

  public async computeMeshAsync(): Promise<THREE.Mesh> {
    this.meshPromise = new Promise(async (resolve, reject) => {
      if (this.meshUpdateRequired) {
        if (this.worker) {
          this.worker.terminate();
          this.worker = null;
        }

        this.worker = new CompoundWorker();
        // listen to events from web worker

        (this.worker as CompoundWorker).onmessage = (event: any) => {
          if (event.data.status !== "ok") {
            (this.worker as CompoundWorker).terminate();
            this.worker = null;
            reject(new Error("Compound Object Error"));
          }

          const message = event.data;
          // recompute object form vertices and normals
          this.fromBufferData(message.vertices, message.normals).then(mesh => {
            this.mesh = mesh;
            if (this.mesh instanceof THREE.Mesh) {
              this.applyOperationsAsync().then(() => {
                this._meshUpdateRequired = false;
                if (this.viewOptionsUpdateRequired) {
                  this.applyViewOptions();
                  this._viewOptionsUpdateRequired = false;
                }
                (this.worker as CompoundWorker).terminate();
                this.worker = null;
                resolve(this.mesh);
              });
            } else {
              (this.worker as CompoundWorker).terminate();
              this.worker = null;
              reject(new Error("Mesh not computed correctly"));
            }
          });
        };
        // END OF EVENT HANDLER

        // Lets create an array of vertices and normals for each child
        this.toBufferArrayAsync().then(bufferArray => {
          const message = {
            bufferArray,
            type: this.getTypeName(),
            numChildren: this.children.length
          };
          (this.worker as CompoundWorker).postMessage(message, bufferArray);
        });

        // mesh update not required
      } else {
        if (this.pendingOperation) {
          await this.applyOperationsAsync();
        }
        this.applyViewOptions();
        resolve(this.mesh);
      }
    });

    return this.meshPromise as Promise<THREE.Mesh>;
  }

  public addChildren(child: ObjectsCommon): void {
    this.children.push(child);
    this._meshUpdateRequired = true;
  }

  public setChildren(children: ChildrenArray): void {
    if (!isEqual(children, this.children)) {
      this.children = children.slice();
      this._meshUpdateRequired = true;
    }
  }

  public toJSON(): ICompoundObjectJSON {
    return cloneDeep({
      ...super.toJSON(),
      children: this.children.map(obj => obj.toJSON())
    });
  }

  public updateFromJSON(object: ICompoundObjectJSON) {
    if (this.id !== object.id) {
      throw new Error("Object id does not match with JSON id");
    }

    const newchildren: ChildrenArray = [];
    // update children
    try {
      object.children.forEach(obj => {
        const objToUpdate = this.getChild(obj);
        newchildren.push(objToUpdate);
        objToUpdate.updateFromJSON(obj);
      });

      if (!isEqual(this.children, newchildren)) {
        this.meshUpdateRequired = true;
        this.children = newchildren.slice(0);
      }
    } catch (e) {
      throw new Error(`Cannot update Compound Object: ${e}`);
    }

    // update operations and view options
    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...object.viewOptions
    };
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

  public async applyOperationsAsync(): Promise<void> {
    // if there are children, mesh is centered at first child position/rotation

    const chMesh = await this.children[0].getMeshAsync();
    this.mesh.position.x = chMesh.position.x;
    this.mesh.position.y = chMesh.position.y;
    this.mesh.position.z = chMesh.position.z;
    this.mesh.quaternion.set(
      chMesh.quaternion.x,
      chMesh.quaternion.y,
      chMesh.quaternion.z,
      chMesh.quaternion.w
    );

    this.mesh.scale.x = 1;
    this.mesh.scale.y = 1;
    this.mesh.scale.z = 1;

    this.operations.forEach(operation => {
      // Translate operation
      if (operation.type === ObjectsCommon.createTranslateOperation().type) {
        this.applyTranslateOperation(operation as ITranslateOperation);
      } else if (
        operation.type === ObjectsCommon.createRotateOperation().type
      ) {
        this.applyRotateOperation(operation as IRotateOperation);
      } else if (operation.type === ObjectsCommon.createScaleOperation().type) {
        this.applyScaleOperation(operation as IScaleOperation);
      } else if (
        operation.type === ObjectsCommon.createMirrorOperation().type
      ) {
        this.applyMirrorOperation(operation as IMirrorOperation);
      } else {
        throw Error("ERROR: Unknown Operation");
      }
    });
    this.mesh.updateMatrixWorld(true);
    this.mesh.updateMatrix();
    this._pendingOperation = false;

    return;
  }

  protected fromBufferData(vertices: any, normals: any): Promise<THREE.Mesh> {
    return new Promise((resolve, reject) => {
      const buffGeometry = new THREE.BufferGeometry();
      buffGeometry.addAttribute(
        "position",
        new THREE.BufferAttribute(vertices, 3)
      );
      buffGeometry.addAttribute(
        "normal",
        new THREE.BufferAttribute(normals, 3)
      );
      const mesh: THREE.Mesh = new THREE.Mesh(
        buffGeometry,
        new THREE.MeshLambertMaterial()
      );
      this.applyViewOptions(mesh);
      resolve(mesh);
    });
  }

  protected toBufferArrayAsync(): Promise<ArrayBuffer[]> {
    return new Promise((resolve, reject) => {
      const bufferArray: ArrayBuffer[] = [];
      Promise.all(
        this.children.map( child => {
          if (
            ["Difference", "Intersection"].includes(this.getTypeName()) &&
            (child instanceof RepetitionObject || child instanceof ObjectsGroup)
          ) {
            const obj = child.toUnion();
            return obj.getMeshAsync();
          }
          return child.getMeshAsync();
        })
      ).then(meshes => {
        meshes.forEach(mesh => {
          if (mesh instanceof THREE.Mesh) {
            bufferArray.push(...ObjectsCommon.meshToBufferArray(mesh));
          } else if (mesh instanceof THREE.Group) {
            bufferArray.push(...ObjectsCommon.groupToBufferArray(mesh));
          }
        });
        resolve(bufferArray);
      });
    });
  }

  /**
   * Returns Object Reference if found in children. If not, throws Error.
   * @param obj Object descriptor
   */
  private getChild(obj: IObjectsCommonJSON): ObjectsCommon {
    const result = this.children.find(object => object.getID() === obj.id);
    if (result) {
      return result;
    }
    throw new Error(`Object id ${obj.id} not found in group`);
  }
}

// they need to be at bottom to avoid typescript error with circular imports
import RepetitionObject from "./RepetitionObject";
import ObjectsGroup from "./ObjectsGroup";
