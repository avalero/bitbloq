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
 * Last modified  : 2018-11-14 10:56:45
 */

import Object3D from './Object3D';
import ObjectsGroup, {IObjectsGroupJSON} from './ObjectsGroup';
import isEqual from 'lodash.isequal';
import ObjectsCommon, {IObjectsCommonJSON} from './ObjectsCommon';

import Scene from './Scene';

export interface IRepetitionObjectJSON extends IObjectsGroupJSON {
  object: IObjectsCommonJSON;
  parameters: ICartesianRepetitionParams | IPolarRepetitionParams;
}

export interface IRepetitionParams{
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
    
    if(obj.type !== RepetitionObject.typeName) throw new Error(`Types do not match ${RepetitionObject.typeName}, ${obj.type}`);
    const object: ObjectsCommon = scene.getObject(obj);

    return new RepetitionObject(obj.parameters, object);
  }


  private object: ObjectsCommon;
  private parameters: ICartesianRepetitionParams | IPolarRepetitionParams;

  /**
   *
   * @param params The parameters of the repetition
   * @param object The object to repeat
   * Creates an ObjectsGroup with cloned objects (Object3D instance) on their new postion
   */
  constructor(
    params: ICartesianRepetitionParams | IPolarRepetitionParams,
    object: ObjectsCommon,
  ) {
    super([]);
    this.parameters = { ...params };
    this.object = object;
    if (this.parameters.type.toLowerCase() === 'cartesian')
      this.cartesianRepetition();
    else if (this.parameters.type.toLowerCase() === 'polar')
      this.polarRepetition();
    else throw new Error('Unknown Repetition Command');
  }

  /**
   * Performs a cartesian repetition of object (nun times), with x,y,z distances
   * It adds repeated objects to ObjectsGroup instance
   */
  private cartesianRepetition() {
    const { x, y, z, type, num } = this
      .parameters as ICartesianRepetitionParams;

    for (let i: number = 0; i < num; i++) {
      if (this.object instanceof Object3D) {
        const objectClone: Object3D = this.object.clone();
        objectClone.translate(i * x, i * y, i * z);
        this.add(objectClone);
      } else if (this.object instanceof ObjectsGroup) {
      }
    }
  }

  public setParameters(
    parameters: ICartesianRepetitionParams | IPolarRepetitionParams,
  ) {
    if (!isEqual(parameters, this.parameters)) {
      this.clean();
      this.parameters = { ...parameters };
      if (this.parameters.type.toLowerCase() === 'cartesian')
        this.cartesianRepetition();
      else if (this.parameters.type.toLowerCase() === 'polar')
        this.polarRepetition();
      else throw new Error('Unknown Repetition Command');
    }
  }

  public clone(): RepetitionObject {
    return new RepetitionObject(this.parameters, this.object);
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
      if (this.object instanceof Object3D) {
        const objectClone: Object3D = this.object.clone();
        //objectClone.translate(i*x, i*y, i*z);
        this.add(objectClone);
      } else if (this.object instanceof ObjectsGroup) {
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

  public toJSON():IRepetitionObjectJSON{
    const obj = { 
      ...super.toJSON(),
      type: this.type,
      parameters: this.parameters,
      object: this.object.toJSON(),
    }
    
    return obj;
  }
}
