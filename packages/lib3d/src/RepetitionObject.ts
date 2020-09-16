/*
 * File: RepetitionObject.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Bitbloq Repository: https://github.com/bitbloq
 * Bitbloq Team: https://github.com/orgs/Bitbloq/people
 * Copyright 2018 - 2019 BQ Educacion.
 */

import ObjectsCommon from "./ObjectsCommon";

import { cloneDeep, isEqual } from "lodash";
import * as THREE from "three";
import Object3D from "./Object3D";
import ObjectsGroup from "./ObjectsGroup";
import Scene from "./Scene";

import {
  ICartesianRepetitionParams,
  IMirrorOperation,
  IPolarRepetitionParams,
  IRepetitionObjectJSON,
  IRotateOperation,
  IScaleOperation,
  ITranslateOperation,
  IViewOptions,
  OperationsArray,
  isScaleOperation,
  isMirrorOperation
} from "./Interfaces";

/**
 * RepetitionObject Class
 * I allows to repeat one object in a cartesian or polar way.
 */
export default class RepetitionObject extends ObjectsCommon {
  get meshUpdateRequired(): boolean {
    return this._meshUpdateRequired || this.originalObject.meshUpdateRequired;
  }

  set meshUpdateRequired(a: boolean) {
    this._meshUpdateRequired = a;
  }

  get pendingOperation(): boolean {
    return this._pendingOperation || this.originalObject.pendingOperation;
  }

  set pendingOperation(a: boolean) {
    this._pendingOperation = a;
  }

  get viewOptionsUpdateRequired(): boolean {
    return (
      this._viewOptionsUpdateRequired ||
      this.originalObject.viewOptionsUpdateRequired
    );
  }

  set viewOptionsUpdateRequired(a: boolean) {
    this._viewOptionsUpdateRequired = a;
  }

  public static typeName = "RepetitionObject";

  /**
   *
   * @param object the object descriptor of the object to be repeated
   * @param scene the scene to which the object belongs
   */
  public static newFromJSON(obj: IRepetitionObjectJSON, scene: Scene) {
    if (obj.type !== RepetitionObject.typeName) {
      throw new Error(
        `Types do not match ${RepetitionObject.typeName}, ${obj.type}`
      );
    }
    try {
      const object: ObjectsCommon = scene.getObject(obj.children[0]);
      // get the color of first children
      obj.viewOptions.color = obj.children[0].viewOptions.color;

      const rep = new RepetitionObject(
        obj.parameters,
        object,
        obj.viewOptions,
        obj.operations
      );
      rep.id = obj.id || rep.id;
      return rep;
    } catch (e) {
      throw new Error(`Cannot create RepetitionObject: ${e}`);
    }
  }

  private originalObject: ObjectsCommon;
  private parameters: ICartesianRepetitionParams | IPolarRepetitionParams;
  private group: ObjectsCommon[];

  /**
   *
   * @param params The parameters of the repetition
   * @param original The object to repeat
   * Creates an ObjectsGroup with cloned objects (Object3D instance) on their new postion
   */
  constructor(
    params: ICartesianRepetitionParams | IPolarRepetitionParams,
    original: ObjectsCommon,
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    operations: OperationsArray = [],
    mesh?: THREE.Group | undefined
  ) {
    const vO: IViewOptions = {
      ...ObjectsCommon.createViewOptions(),
      ...original.toJSON().viewOptions,
      ...viewOptions
    };

    super(vO, operations);
    this.parameters = { ...params };
    this.originalObject = original;
    this.originalObject.setParent(this);
    this.type = RepetitionObject.typeName;
    this.meshUpdateRequired = true;
    this.pendingOperation = true;
    this.group = [];
    this.mesh = new THREE.Group();
    if (mesh) {
      this.setMesh(mesh);
    } else {
      this.meshPromise = this.computeMeshAsync();
    }
  }

  public setParameters(
    parameters: ICartesianRepetitionParams | IPolarRepetitionParams
  ) {
    if (!isEqual(parameters, this.parameters)) {
      this.parameters = { ...parameters };
      this._meshUpdateRequired = true;
    }
  }

  public clone(): RepetitionObject {
    if (this.mesh && !(this.meshUpdateRequired || this.pendingOperation)) {
      const repObj = new RepetitionObject(
        cloneDeep(this.parameters),
        this.originalObject.clone(),
        cloneDeep(this.viewOptions),
        cloneDeep(this.operations),
        (this.mesh as THREE.Group).clone()
      );

      repObj.group = this.group.map(objgroup => objgroup.clone());
      return repObj;
    }
    const obj = new RepetitionObject(
      cloneDeep(this.parameters),
      this.originalObject.clone(),
      cloneDeep(this.viewOptions),
      cloneDeep(this.operations)
    );
    return obj;
  }

  /**
   * Returns the group (instance of ObjectsGroup) of this RepetitionObject,
   * applying all the operations to children
   */
  public getGroup(): ObjectsGroup {
    const globalOperations = cloneDeep(this.operations);

    if (this.parameters.type.toLowerCase() === "cartesian") {
      this.group.forEach(obj => {
        const objectOperations = obj
          .getOperations()
          .slice(0)
          .reverse()
          .map(operation => {
            if (
              operation.type === Object3D.createTranslateOperation().type ||
              operation.type === Object3D.createRotateOperation().type
            ) {
              const op: ITranslateOperation | IRotateOperation = {
                ...(operation as ITranslateOperation | IRotateOperation)
              };
              op.relative = !op.relative;
              return op;
            }
            return { ...operation };
          });

        // first set globalOperations
        obj.setOperations(globalOperations);

        // then set object operations in reverse order
        obj.addOperations(objectOperations);
      });
    } else {
      this.group.forEach(obj => {
        const objectOperations = obj
          .getOperations()
          .slice(0)
          .map(operation => {
            if (
              operation.type === Object3D.createTranslateOperation().type ||
              operation.type === Object3D.createRotateOperation().type
            ) {
              const op: ITranslateOperation | IRotateOperation = {
                ...(operation as ITranslateOperation | IRotateOperation)
              };
              // op.relative = !op.relative;
              return op;
            }
            return { ...operation };
          });

        // first set globalOperations
        obj.setOperations(globalOperations);

        // then set object operations in reverse order
        obj.addOperations(objectOperations);
      });
    }

    return new ObjectsGroup(this.group, this.viewOptions);
  }

  public toJSON(): IRepetitionObjectJSON {
    const obj = {
      ...super.toJSON(),
      children: [this.originalObject.toJSON()],
      parameters: this.parameters
    };
    return obj;
  }

  public getOriginal(): ObjectsCommon {
    return this.originalObject;
  }

  /**
   * Updates objects belonging to a group. Group members cannot be changed.
   * If group members do not match an Error is thrown
   * @param object ObjectGroup descriptor object
   */
  public updateFromJSON(
    object: IRepetitionObjectJSON,
    fromParent = false,
    forceUpdate = false
  ) {
    if (object.id !== this.id) {
      throw new Error(`ids do not match ${object.id}, ${this.id}`);
    }

    if (object.children[0].id !== this.originalObject.getID()) {
      throw new Error(
        `object child ids do not match ${
          object.children[0].id
        }, ${this.originalObject.getID()}`
      );
    }

    try {
      this.setParameters(object.parameters);
      this.setOperations(object.operations);
      this.setViewOptions(object.viewOptions);
      // check if there are any updates pending on Original Object before updating it
      const update =
        forceUpdate ||
        this.meshUpdateRequired ||
        this.pendingOperation ||
        this.viewOptionsUpdateRequired;

      this.meshUpdateRequired = update;

      this.originalObject.updateFromJSON(object.children[0], true);

      // if it has a parent, update through parent
      const parentObject: ObjectsCommon | undefined = this.getParent();

      if (parentObject && !fromParent) {
        parentObject.updateFromJSON(parentObject.toJSON(), false, true);
      } else {
        if (
          update ||
          this.meshUpdateRequired ||
          this.pendingOperation ||
          this.viewOptionsUpdateRequired
        ) {
          this.meshPromise = this.computeMeshAsync();
        }
      }
    } catch (e) {
      throw new Error(`Cannot update Group: ${e}`);
    }
  }

  public async computeMeshAsync(): Promise<THREE.Group> {
    this.meshPromise = new Promise(async (resolve, reject) => {
      if (this.originalObject instanceof ObjectsGroup) {
        this.group = [];
        for (const child of this.originalObject.clone().unGroup()) {
          const rep = new RepetitionObject(
            this.parameters,
            child,
            child.getViewOptions()
          );
          rep.meshPromise = rep.computeMeshAsync();
          this.group.push(rep);
        }
      } else if (
        this.meshUpdateRequired ||
        this.originalObject.pendingOperation ||
        this.originalObject.viewOptionsUpdateRequired
      ) {
        await this.computeRepetitonAsync();
      }

      this.originalObject.userData = {
        ...this.originalObject.userData,
        objectClone: this.group[0]
      };

      const meshes = await Promise.all(
        this.group.map(obj => obj.getMeshAsync())
      );
      this.mesh.children.length = 0;
      meshes.forEach(mesh => {
        this.mesh.add(mesh);
        mesh.userData = {
          ...mesh.userData,
          originalObject: this.originalObject,
          repetitionObject: true
        };
      });

      await this.applyOperationsAsync();

      if (this.mesh instanceof THREE.Group) {
        resolve(this.mesh);
      } else {
        reject(new Error("Unexpected Error computing RepetitionObject"));
      }
    });

    return this.meshPromise as Promise<THREE.Group>;
  }

  protected async applyOperationsAsync(): Promise<void> {
    this.mesh.position.set(0, 0, 0);
    this.mesh.quaternion.setFromEuler(new THREE.Euler(0, 0, 0));

    this.mesh.scale.x = 1;
    this.mesh.scale.y = 1;
    this.mesh.scale.y = 1;

    this.operations.forEach(operation => {
      // Translate operation
      if (operation.type === Object3D.createTranslateOperation().type) {
        this.applyTranslateOperation(operation as ITranslateOperation);
      } else if (operation.type === Object3D.createRotateOperation().type) {
        this.applyRotateOperation(operation as IRotateOperation);
      } else if (operation.type === Object3D.createScaleOperation().type) {
        // nothing to do here
      } else if (operation.type === Object3D.createMirrorOperation().type) {
        // nothing to do here
      } else {
        throw Error("ERROR: Unknown Operation");
      }
    });

    this.applyAllScaleOperations();

    this.pendingOperation = false;
    this.mesh.updateMatrixWorld(true);
    this.mesh.updateMatrix();

    return;
  }

  protected applyMirrorOperation(operation: IMirrorOperation): void {
    // nothing to do here
  }

  protected applyTranslateOperation(operation: ITranslateOperation): void {
    if (operation.relative) {
      this.mesh.translateX(operation.x);
      this.mesh.translateY(operation.y);
      this.mesh.translateZ(operation.z);
    } else {
      // absolute x,y,z axis.
      this.mesh.position.x += Number(operation.x);
      this.mesh.position.y += Number(operation.y);
      this.mesh.position.z += Number(operation.z);
    }
  }

  protected applyRotateOperation(operation: IRotateOperation): void {
    const x = THREE.Math.degToRad(Number(operation.x));
    const y = THREE.Math.degToRad(Number(operation.y));
    const z = THREE.Math.degToRad(Number(operation.z));
    if (operation.relative) {
      this.mesh.rotateX(x);
      this.mesh.rotateY(y);
      this.mesh.rotateZ(z);
    } else {
      this.mesh.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), x);
      this.mesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), y);
      this.mesh.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), z);
    }
  }

  protected applyAllScaleOperations(): void {
    const reducer = (
      accumulator: number[],
      op:
        | IScaleOperation
        | ITranslateOperation
        | IRotateOperation
        | IMirrorOperation
    ) => {
      if (isScaleOperation(op)) {
        accumulator[0] *= op.x;
        accumulator[1] *= op.y;
        accumulator[2] *= op.z;
      }

      if (isMirrorOperation(op)) {
        if (op.plane === "xy") {
          accumulator[2] *= -1;
        } else if (op.plane === "yz") {
          accumulator[0] *= -1;
        } else if (op.plane === "zx") {
          accumulator[1] *= -1;
        }
      }

      return accumulator;
    };

    const scale: number[] = this.operations.reduce(reducer, [1, 1, 1]);
    this.mesh.scale.set(scale[0], scale[1], scale[2]);
  }
  protected applyScaleOperation(operation: IScaleOperation): void {
    // nothing to do here
  }

  private setMesh(mesh: THREE.Group): void {
    this.mesh = mesh;

    this.meshUpdateRequired = false;
    this.pendingOperation = false;
    this.viewOptionsUpdateRequired = false;

    this.mesh.updateMatrixWorld(true);
    this.mesh.updateMatrix();
  }

  /**
   * Performs a cartesian repetition of object (nun times), with x,y,z distances
   * It adds repeated objects to ObjectsGroup instance
   */

  private async cartesianRepetitionAsync(): Promise<void> {
    this.mesh.children.length = 0;
    this.group.length = 0;

    if (this.parameters.type !== "cartesian") {
      throw new Error("No cartesian operation");
    }

    const { x, y, z, num } = this.parameters;

    if (this.originalObject.meshPromise) {
      await this.originalObject.computeMeshAsync();
    }

    for (let i = 0; i < num; i += 1) {
      if (this.originalObject instanceof ObjectsCommon) {
        const objectClone: ObjectsCommon = this.originalObject.clone();
        const json = objectClone.toJSON();
        // clone operations (to avoid changing referenced array)
        json.operations = [...json.operations];
        json.operations.push(
          ObjectsCommon.createTranslateOperation(i * x, i * y, i * z, false)
        );
        objectClone.updateFromJSON(json);
        objectClone.setParent(this);
        this.group.push(objectClone);
      }
    }
  }

  /**
   * Performs a polar repetition of object (nun times), with x or y or z direction and total ange
   * It adds repeated objects to ObjectsGroup instance
   */
  // TODO
  private async polarRepetitionAsync(): Promise<void> {
    this.mesh.children.length = 0;
    this.group.length = 0;

    if (this.parameters.type !== "polar") {
      throw new Error("No polar operation");
    }

    const { axis, angle, num } = this.parameters;

    if (this.originalObject.meshPromise) {
      await this.originalObject.computeMeshAsync();
    }

    const baseMesh = await this.originalObject.getMeshAsync();
    const initialMatrix: THREE.Matrix4 = baseMesh.matrix;

    for (let i = 0; i < num; i += 1) {
      const newObject = this.originalObject.clone();
      // rotate newObject around axis.
      const rotationAxis: THREE.Vector3 = new THREE.Vector3();
      if (axis === "x") {
        rotationAxis.set(1, 0, 0);
      } else if (axis === "y") {
        rotationAxis.set(0, 1, 0);
      } else if (axis === "z") {
        rotationAxis.set(0, 0, 1);
      }

      const rad2deg = (rad: number) => rad * (180 / Math.PI);
      const deg2rad = (deg: number) => (deg * Math.PI) / 180;

      const degrees: number = (i * angle) / (num - 1);
      const rotationMatrix: THREE.Matrix4 = new THREE.Matrix4().makeRotationAxis(
        rotationAxis,
        deg2rad(degrees)
      );

      const finalMatrix: THREE.Matrix4 = new THREE.Matrix4().multiplyMatrices(
        rotationMatrix,
        initialMatrix
      );

      const finalPosition: THREE.Vector3 = new THREE.Vector3().setFromMatrixPosition(
        finalMatrix
      );
      const finalScale: THREE.Vector3 = new THREE.Vector3().setFromMatrixScale(
        finalMatrix
      );
      const finalRotation: THREE.Euler = new THREE.Euler().setFromRotationMatrix(
        finalMatrix,
        "XYZ"
      );

      newObject.setOperations([
        ObjectsCommon.createTranslateOperation(
          finalPosition.x,
          finalPosition.y,
          finalPosition.z,
          false
        ),
        ObjectsCommon.createRotateOperation(
          rad2deg(finalRotation.x),
          0,
          0,
          false
        ),
        ObjectsCommon.createRotateOperation(
          0,
          rad2deg(finalRotation.y),
          0,
          true
        ),
        ObjectsCommon.createRotateOperation(
          0,
          0,
          rad2deg(finalRotation.z),
          true
        ),
        ObjectsCommon.createScaleOperation(
          finalScale.x,
          finalScale.y,
          finalScale.z
        )
      ]);

      newObject.computeMeshAsync();
      newObject.setParent(this);
      this.group.push(newObject);
    }
  }

  private async computeRepetitonAsync(): Promise<void> {
    this.mesh.children.length = 0;
    this.group.length = 0;
    if (this.parameters.type.toLowerCase() === "cartesian") {
      await this.cartesianRepetitionAsync();
    } else if (this.parameters.type.toLowerCase() === "polar") {
      await this.polarRepetitionAsync();
    } else {
      throw new Error("Unknown Repetition Command");
    }

    this.meshUpdateRequired = false;
    this.pendingOperation = false;
    this.viewOptionsUpdateRequired = false;
  }
}
