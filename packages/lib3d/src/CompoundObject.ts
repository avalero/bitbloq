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
 * Last modified  : 2019-01-31 10:33:02
 */
import * as Bitbloq from './Bitbloq';
import Object3D from './Object3D';
import ObjectsCommon from './ObjectsCommon';
import {
  IMirrorOperation,
  IObjectsCommonJSON,
  IRotateOperation,
  IScaleOperation,
  ITranslateOperation,
  IViewOptions,
  OperationsArray,
  ICompoundObjectJSON,
} from './Interfaces';
import * as THREE from 'three';
import Worker from './compound.worker';

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

  set viewOptionsUpdateRequired(a: boolean) {
    this._viewOptionsUpdateRequired = a;
  }

  get viewOptionsUpdateRequired(): boolean {
    return this._viewOptionsUpdateRequired;
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
  protected worker: Worker | null;

  constructor(
    children: ChildrenArray = [],
    operations: OperationsArray = [],
    viewOptions: IViewOptions = ObjectsCommon.createViewOptions()
  ) {
    super(viewOptions, operations);
    if (children.length === 0) {
      throw new Error('Compound Object requires at least one children');
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
    // if (this.meshPromise) this.meshUpdateRequired = true;
    this.meshPromise = new Promise(async (resolve, reject) => {
      if (this.meshUpdateRequired) {
        if (this.worker) {
          this.worker.terminate();
          this.worker = null;
        }

        this.worker = new Worker('http://bitbloq.bq.com');
        // listen to events from web worker

        (this.worker as Worker).onmessage = (event: any) => {
          if (event.data.status !== 'ok') {
            (this.worker as Worker).terminate();
            this.worker = null;
            reject(new Error('Compound Object Error'));
          }

          const message = event.data;

          debugger;

          // save vertices and normals

          // const verticesBuffer: ArrayBuffer = message.verticesData;
          // const normalsBuffer: ArrayBuffer = message.normalsData;

          // const vertices: ArrayLike<number> = new Float32Array(
          //   verticesBuffer,
          //   0,
          //   verticesBuffer.byteLength / Float32Array.BYTES_PER_ELEMENT
          // );

          // const normals: ArrayLike<number> = new Float32Array(
          //   normalsBuffer,
          //   0,
          //   normalsBuffer.byteLength / Float32Array.BYTES_PER_ELEMENT
          // );

          // const vertices: Float32Array = message.verticesData;
          // const normals: Float32Array = message.normalsData;

          // this.verticesArray = Array.from(vertices);
          // this.normalsArray = Array.from(normals);

          // recompute object form vertices and normals

          this.fromBufferData(message.verticesData, message.normalsData).then(
            mesh => {
              this.mesh = mesh;
              if (this.mesh instanceof THREE.Mesh) {
                this.applyOperationsAsync().then(() => {
                  if (this.viewOptionsUpdateRequired) {
                    this.applyViewOptions();
                  }
                  (this.worker as Worker).terminate();
                  this.worker = null;
                  resolve(this.mesh);

                  // mesh updated and resolved
                  this.pendingOperation = false;
                  this.meshUpdateRequired = false;
                  this.viewOptionsUpdateRequired = false;
                });
              } else {
                (this.worker as Worker).terminate();
                this.worker = null;
                reject(new Error('Mesh not computed correctly'));
              }
            }
          );
        };
        // END OF EVENT HANDLER

        // Lets create an array of vertices and normals for each child
        this.toBufferArrayAsync().then(bufferArray => {
          const message = {
            bufferArray,
            type: this.getTypeName(),
            numChildren: this.children.length,
          };
          (this.worker as Worker).postMessage(message, bufferArray);
        });

        // mesh update not required
      } else {
        if (this.pendingOperation) {
          await this.applyOperationsAsync();
        }

        if (this.viewOptionsUpdateRequired) {
          this.applyViewOptions();
        }
        resolve(this.mesh);
        // mesh updated and resolved
        this.pendingOperation = false;
        this.meshUpdateRequired = false;
        this.viewOptionsUpdateRequired = false;
      }
    });

    return this.meshPromise as Promise<THREE.Mesh>;
  }

  public addChildren(child: ObjectsCommon): void {
    this.children.push(child);
    this._meshUpdateRequired = true;
  }

  public toJSON(): ICompoundObjectJSON {
    const json: ICompoundObjectJSON = {
      ...super.toJSON(),
      children: this.children.map(obj => obj.toJSON()),
    };
    return json;
  }

  public updateFromJSON(
    object: ICompoundObjectJSON,
    fromParent: boolean = false
  ) {
    if (this.id !== object.id) {
      throw new Error('Object id does not match with JSON id');
    }

    // update operations and view options
    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...object.viewOptions,
    };
    this.setOperations(object.operations);
    this.setViewOptions(vO);
    const update =
      this.meshUpdateRequired ||
      this.pendingOperation ||
      this.viewOptionsUpdateRequired;
    this.setChildren(object.children);

    try {
      if (
        update ||
        this.meshUpdateRequired ||
        this.pendingOperation ||
        this.viewOptionsUpdateRequired
      ) {
        // if has no parent, update mesh, else update through parent
        const parentObj: ObjectsCommon | undefined = this.getParent();
        if (parentObj && !fromParent) {
          parentObj.updateFromJSON(parentObj.toJSON());
        } else {
          // if anything has changed, recompute children and then recompute mesh
          this.children.forEach(child => {
            child.updateFromJSON(child.toJSON(), true);
          });

          this.meshPromise = this.computeMeshAsync();
        }
      }
    } catch (e) {
      throw new Error(`Cannot update Compound Object: ${e}`);
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

    this.mesh.scale.x = chMesh.scale.x;
    this.mesh.scale.y = chMesh.scale.y;
    this.mesh.scale.z = chMesh.scale.z;

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
        throw Error('ERROR: Unknown Operation');
      }
    });
    this.mesh.updateMatrixWorld(true);
    this.mesh.updateMatrix();
    this.pendingOperation = false;

    return;
  }

  protected fromBufferData(vertices: any, normals: any): Promise<THREE.Mesh> {
    return new Promise((resolve, reject) => {
      const buffGeometry = new THREE.BufferGeometry();
      debugger;
      buffGeometry.addAttribute(
        'position',
        new THREE.BufferAttribute(vertices, 3)
      );
      buffGeometry.addAttribute(
        'normal',
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
        this.children.map(child => {
          if (
            ['Difference', 'Intersection'].includes(this.getTypeName()) &&
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

  private setChildren(children: IObjectsCommonJSON[]) {
    const currentChildren: IObjectsCommonJSON[] = this.toJSON().children;

    // children are the same do not update anything.
    if (Bitbloq.compareObjectsJSONArray(currentChildren, children)) return;

    // if children are not the same
    this.meshUpdateRequired = true;
    const newchildren: ChildrenArray = [];
    // update children

    children.forEach(objChild => {
      const objToUpdate: ObjectsCommon = this.getChild(objChild);
      newchildren.push(objToUpdate);
      objToUpdate.updateFromJSON(objChild, true);
    });

    this.children = newchildren;
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
import RepetitionObject from './RepetitionObject';
import ObjectsGroup from './ObjectsGroup';
