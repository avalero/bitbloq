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
 * Last modified  : 2018-11-09 12:26:51
 */

import * as THREE from 'three';
import {Object3D} from './Object3D';
import ObjectsGroup from './ObjectsGroup';


export interface ICartesianRepetitionParams{
  num : number;
  x: number;
  y: number;
  z: number;
  type: string;
}

export interface IPolarRepetitionParams{
  num : number;
  angle: number;
  axis: string;
  type: string;
}

/**
 * RepetitionObject Class
 * I allows to repeat one object in a cartesian or polar way.
 */
export default class RepetitionObject{

  public static typeName:string = 'RepetitionObject';

  private group: ObjectsGroup;
  private object: Object3D;
  private parameters: ICartesianRepetitionParams | IPolarRepetitionParams;

  /**
   * 
   * @param params The parameters of the repetition
   * @param object The object to repeat
   * Creates an ObjectsGroup with cloned objects (Object3D instance) on their new postion
   */
  constructor(params: ICartesianRepetitionParams | IPolarRepetitionParams, object: Object3D){
    this.parameters = {...params}
    this.group = new ObjectsGroup();
    this.object = object;
    if (this.parameters.type.toLowerCase() === "cartesian") this.cartesianRepetition();
    else this.polarRepetition();
  }

  /**
   * Performs a cartesian repetition of object (nun times), with x,y,z distances
   * It adds repeated objects to ObjectsGroup instance
   */
  private cartesianRepetition(){
    const {x , y, z, type, num} = this.parameters as ICartesianRepetitionParams;

    for (let i:number = 0; i<num; i++){
      const object:Object3D = this.object.clone();
      object.translate(i*x, i*y, i*z);
      this.group.add(object);
    } 
  }

  private setParameters(params: ICartesianRepetitionParams | IPolarRepetitionParams) {
    this.parameters = {...params};
    this.group = new ObjectsGroup();
    if (this.parameters.type.toLowerCase() === "cartesian") this.cartesianRepetition();
    else this.polarRepetition();
  }

  /**
   * Performs a polar repetition of object (nun times), with x or y or z direction and total ange
   * It adds repeated objects to ObjectsGroup instance
   */
  //TODO
  private polarRepetition(){
    const {axis , angle, type, num} = this.parameters as IPolarRepetitionParams;

    for (let i:number = 0; i<num; i++){
      const object:Object3D = this.object.clone();
      //object.translate(i*x, i*y, i*z);
      this.group.add(object);
    } 
  }

  /**
   * Returns the group (instance of ObjectsGroup) of this RepetitionObject
   */
  public getGroup():ObjectsGroup{
    return this.group;
  }

  /**
   * THREE.Group Object 3D returned as a Promise
   */
  public getMeshAsync(): Promise<THREE.Group> {
    return this.group.getMeshAsync();
  }
}
