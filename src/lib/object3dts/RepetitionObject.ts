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
 * Last modified  : 2018-11-28 16:14:33
 */

import Object3D from './Object3D';
import ObjectsGroup, { IObjectsGroupJSON } from './ObjectsGroup';
import isEqual from 'lodash.isequal';
import ObjectsCommon, { IObjectsCommonJSON } from './ObjectsCommon';

import Scene from './Scene';

export interface IRepetitionObjectJSON extends IObjectsGroupJSON {
  parameters: ICartesianRepetitionParams | IPolarRepetitionParams;
}

export interface IRepetitionParams {
  num: number;
  type: string;
}

export interface ICartesianRepetitionParams extends IRepetitionParams {
  x: number;
  y: number;
  z: number;
}

export interface IPolarRepetitionParams extends IRepetitionParams {
  angle: number;
  axis: string;
}

/**
 * RepetitionObject Class
 * I allows to repeat one object in a cartesian or polar way.
 */
export default class RepetitionObject extends ObjectsGroup {
  public static typeName: string = 'RepetitionObject';

  /**
   *
   * @param object the object descriptor of the object to be repeated
   * @param scene the scene to which the object belongs
   */
  public static newFromJSON(obj: IRepetitionObjectJSON, scene: Scene) {
    if (obj.type !== RepetitionObject.typeName)
      throw new Error(
        `Types do not match ${RepetitionObject.typeName}, ${obj.type}`,
      );
    try {
      const object: ObjectsCommon = scene.getObject(obj.children[0]);
      return new RepetitionObject(obj.parameters, object);
    } catch (e) {
      throw new Error(`Cannot create RepetitionObject: ${e}`);
    }
  }

  private originalObject: ObjectsCommon;
  private parameters: ICartesianRepetitionParams | IPolarRepetitionParams;

  /**
   *
   * @param params The parameters of the repetition
   * @param original The object to repeat
   * Creates an ObjectsGroup with cloned objects (Object3D instance) on their new postion
   */
  constructor(
    params: ICartesianRepetitionParams | IPolarRepetitionParams,
    original: ObjectsCommon,
  ) {
    super([]);
    this.parameters = { ...params };
    this.originalObject = original;
    this.type = RepetitionObject.typeName;
    this._meshUpdateRequired = true;
    this._pendingOperation = true;
  }

  /**
   * Performs a cartesian repetition of object (nun times), with x,y,z distances
   * It adds repeated objects to ObjectsGroup instance
   */
  private cartesianRepetition() {
    this.clean();
    const { x, y, z, type, num } = this
      .parameters as ICartesianRepetitionParams;
    for (let i: number = 0; i < num; i++) {
      if (this.originalObject instanceof Object3D) {
        const objectClone: Object3D = this.originalObject.clone();
        objectClone.translate(i * x, i * y, i * z);
        this.add(objectClone);
      } else if (this.originalObject instanceof ObjectsGroup) {
        // TODO
      }
    }
  }

  public setParameters(
    parameters: ICartesianRepetitionParams | IPolarRepetitionParams,
  ) {
    if (!isEqual(parameters, this.parameters)) {
      this.clean();
      this.parameters = { ...parameters };
      this._meshUpdateRequired = true;
    }
  }

  public clone(): RepetitionObject {
    return new RepetitionObject(this.parameters, this.originalObject);
  }

  /**
   * Performs a polar repetition of object (nun times), with x or y or z direction and total ange
   * It adds repeated objects to ObjectsGroup instance
   */
  //TODO
  private polarRepetition() {
    const { axis, angle, type, num } = this
      .parameters as IPolarRepetitionParams;

    for (let i: number = 0; i < num; i++) {
      if (this.originalObject instanceof Object3D) {
        const objectClone: Object3D = this.originalObject.clone();
        //objectClone.translate(i*x, i*y, i*z);
        this.add(objectClone);
      } else if (this.originalObject instanceof ObjectsGroup) {
      }
    }
  }

  /**
   * Returns the group (instance of ObjectsGroup) of this RepetitionObject,
   * applying all the operations to children
   */
  public getGroup(): ObjectsGroup {
    return new ObjectsGroup(this.unGroup());
  }

  public toJSON(): IRepetitionObjectJSON {
    const obj = {
      ...super.toJSON(),
      type: this.type,
      parameters: this.parameters,
      children: [this.originalObject.toJSON()],
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
  public updateFromJSON(object: IRepetitionObjectJSON) {
    if (object.id !== this.id)
      throw new Error(`ids do not match ${object.id}, ${this.id}`);

    if (object.children[0].id !== this.originalObject.getID())
      throw new Error(
        `object child ids do not match ${
          object.children[0].id
        }, ${this.originalObject.getID()}`,
      );

    try {
      this.originalObject.updateFromJSON(object.children[0]);
      this.setParameters(object.parameters);
      this.setOperations(object.operations);
    } catch (e) {
      throw new Error(`Cannot update Group: ${e}`);
    }
  }

  get meshUpdateRequired(): boolean {
    return this._meshUpdateRequired || this.originalObject.meshUpdateRequired;
  }

  get pendingOperation(): boolean {
    return this._pendingOperation || this.originalObject.pendingOperation;
  }

  public getMeshAsync(): Promise<THREE.Group> {
    //check if originalObject has changed
    if (this.meshUpdateRequired || this.pendingOperation) {
      this.computeMesh();
    }

    return super.getMeshAsync();
  }

  private computeMesh(): void {
    if (this.parameters.type.toLowerCase() === 'cartesian')
      this.cartesianRepetition();
    else if (this.parameters.type.toLowerCase() === 'polar')
      this.polarRepetition();
    else throw new Error('Unknown Repetition Command');
  }
}
