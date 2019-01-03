/**
 * Copyright (c) 2018 Bitbloq (BQ)
 *
 * License: MIT
 *
 * long description for the file
 *
 * @summary short description for the file
 * @author David García <https://github.com/empoalp>,
 * @author Alberto Valero <https://github.com/avalero>
 *
 * Created at     : 2018-11-07 13:45:37
 * Last modified  : 2019-01-03 07:38:40
 */

import ObjectsCommon, {
  IMirrorOperation,
  IObjectsCommonJSON,
  IRotateOperation,
  IScaleOperation,
  ITranslateOperation,
  IViewOptions
} from "./ObjectsCommon";

import cloneDeep from "lodash.clonedeep";
import isEqual from "lodash.isequal";
import * as THREE from "three";
import Object3D from "./Object3D";
import ObjectsGroup from "./ObjectsGroup";
import PositionCalculator from "./PositionCalculator";
import Scene from "./Scene";
import Union from "./Union";

export interface IRepetitionObjectJSON extends IObjectsCommonJSON {
  parameters: ICartesianRepetitionParams | IPolarRepetitionParams;
  children: IObjectsCommonJSON[];
}

export interface IRepetitionParams {
  num: number;
  type: string;
}

export interface ICartesianRepetitionParams extends IRepetitionParams {
  type: "cartesian";
  x: number;
  y: number;
  z: number;
}

export interface IPolarRepetitionParams extends IRepetitionParams {
  type: "polar";
  angle: number;
  axis: string;
}

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
  public static typeName: string = "RepetitionObject";

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
      return new RepetitionObject(obj.parameters, object, obj.viewOptions);
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
    mesh?: THREE.Group | undefined
  ) {
    const vO: IViewOptions = {
      ...ObjectsCommon.createViewOptions(),
      ...original.toJSON().viewOptions,
      ...viewOptions
    };

    super(vO, []);
    this.parameters = { ...params };
    this.originalObject = original;
    this.originalObject.setParent(this);
    this.type = RepetitionObject.typeName;
    this._meshUpdateRequired = true;
    this._pendingOperation = true;
    this.group = [];
    this.mesh = new THREE.Group();
    this.lastJSON = this.toJSON();
    if (mesh) {
      this.setMesh(mesh);
    } else {
      this.meshPromise = this.computeMeshAsync();
    }
  }

  public toUnion(): Union {
    const group = this.getGroup();
    return group.toUnion();
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
    if (isEqual(this.lastJSON, this.toJSON())) {
      const repObj = new RepetitionObject(
        this.parameters,
        this.originalObject.clone(),
        this.viewOptions,
        (this.mesh as THREE.Group).clone()
      );
      return repObj;
    }
    const obj = new RepetitionObject(
      this.parameters,
      this.originalObject.clone(),
      this.viewOptions
    );
    return obj;
  }

  /**
   * Returns the group (instance of ObjectsGroup) of this RepetitionObject,
   * applying all the operations to children
   */
  public getGroup(): ObjectsGroup {
    return new ObjectsGroup(this.group);
  }

  public toJSON(): IRepetitionObjectJSON {
    const obj = cloneDeep({
      ...super.toJSON(),
      parameters: this.parameters,
      children: [this.originalObject.toJSON()]
    });

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
  public updateFromJSON(object: IRepetitionObjectJSON) {
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
      this.originalObject.updateFromJSON(object.children[0]);
      this.setParameters(object.parameters);
      this.setOperations(object.operations);

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
    } catch (e) {
      throw new Error(`Cannot update Group: ${e}`);
    }
  }

  public async computeMeshAsync(): Promise<THREE.Group> {
    this.meshPromise = new Promise(async (resolve, reject) => {
      if (
        this.meshUpdateRequired ||
        this.originalObject.pendingOperation ||
        this.originalObject.viewOptionsUpdateRequired
      ) {
        await this.computeRepetitonAsync();
      }

      const meshes = await Promise.all(
        this.group.map(obj => obj.getMeshAsync())
      );
      this.mesh.children.length = 0;
      meshes.forEach(mesh => {
        this.mesh.add(mesh);
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
    this.mesh.quaternion.setFromEuler(new THREE.Euler(0, 0, 0), true);

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
        this.applyScaleOperation(operation as IScaleOperation);
      } else if (operation.type === Object3D.createMirrorOperation().type) {
        this.applyMirrorOperation(operation as IMirrorOperation);
      } else {
        throw Error("ERROR: Unknown Operation");
      }
    });
    this._pendingOperation = false;
    this.mesh.updateMatrixWorld(true);
    this.mesh.updateMatrix();

    return;
  }

  protected applyMirrorOperation(operation: IMirrorOperation): void {
    if (operation.plane === "xy") {
      this.applyScaleOperation(Object3D.createScaleOperation(1, 1, -1));
    } else if (operation.plane === "yz") {
      this.applyScaleOperation(Object3D.createScaleOperation(-1, 1, 1));
    } else if (operation.plane === "zx") {
      this.applyScaleOperation(Object3D.createScaleOperation(1, -1, 1));
    }
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

  protected applyScaleOperation(operation: IScaleOperation): void {
    if (
      Number(operation.x) > 0 &&
      Number(operation.y) > 0 &&
      Number(operation.z) > 0
    ) {
      this.mesh.scale.set(
        this.mesh.scale.x * Number(operation.x),
        this.mesh.scale.y * Number(operation.y),
        this.mesh.scale.z * Number(operation.z)
      );
    }
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

    const { x, y, z, type, num } = this.parameters;

    for (let i: number = 0; i < num; i += 1) {
      if (this.originalObject instanceof ObjectsCommon) {
        const objectClone: ObjectsCommon = this.originalObject.clone();
        const json = objectClone.toJSON();
        json.operations.push(
          ObjectsCommon.createTranslateOperation(i * x, i * y, i * z, false)
        );
        objectClone.updateFromJSON(json);
        this.group.push(objectClone);
      }
    }
  }

  private setMesh(mesh: THREE.Group): void {
    this.mesh = mesh;
    this._meshUpdateRequired = false;
    this._pendingOperation = false;
    this.mesh.updateMatrixWorld(true);
    this.mesh.updateMatrix();
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
      throw new Error("No cartesian operation");
    }

    const { axis, angle, type, num } = this.parameters;
    const baseObject = this.originalObject.clone();

    const positionCalculator = new PositionCalculator(baseObject);
    const basePosition = await positionCalculator.getPositionAsync();

    const baseJSON = baseObject.toJSON();
    baseJSON.operations.push(
      ObjectsCommon.createTranslateOperation(
        -basePosition.position.x,
        -basePosition.position.y,
        -basePosition.position.z,
        false
      )
    );

    baseObject.updateFromJSON(baseJSON);

    for (let i: number = 0; i < num; i += 1) {
      if (baseObject instanceof ObjectsCommon) {
        const objectClone: ObjectsCommon = baseObject.clone();
        const json = objectClone.toJSON();
        const rotation = ObjectsCommon.createRotateOperation(0, 0, 0, false);
        rotation[axis] = (i * angle) / (num - 1);
        json.operations.push(rotation);
        json.operations.push(
          ObjectsCommon.createTranslateOperation(
            basePosition.position.x,
            basePosition.position.y,
            basePosition.position.z,
            true
          )
        );

        objectClone.updateFromJSON(json);
        this.group.push(objectClone);
      }
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

    this._meshUpdateRequired = false;
    this._pendingOperation = false;
  }
}
