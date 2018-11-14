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
 * Last modified  : 2018-11-14 09:27:34
 */

import Object3D from './Object3D';
import ObjectsGroup from './ObjectsGroup';
import isEqual from 'lodash.isequal';


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
export default class RepetitionObject extends ObjectsGroup{

  public static typeName:string = 'RepetitionObject';

  private object: Object3D;
  private parameters: ICartesianRepetitionParams | IPolarRepetitionParams;

  /**
   * 
   * @param params The parameters of the repetition
   * @param object The object to repeat
   * Creates an ObjectsGroup with cloned objects (Object3D instance) on their new postion
   */
  constructor(params: ICartesianRepetitionParams | IPolarRepetitionParams, object: Object3D){
    super();
    this.parameters = {...params}
    this.object = object;
    if (this.parameters.type.toLowerCase() === "cartesian") this.cartesianRepetition();
    else if (this.parameters.type.toLowerCase() === "polar") this.polarRepetition();
    else throw new Error('Unknown Repetition Command');
  }

  /**
   * Performs a cartesian repetition of object (nun times), with x,y,z distances
   * It adds repeated objects to ObjectsGroup instance
   */
  private cartesianRepetition(){
    const {x , y, z, type, num} = this.parameters as ICartesianRepetitionParams;

    for (let i:number = 0; i<num; i++){
      const objectClone:Object3D = this.object.clone();
      objectClone.translate(i*x, i*y, i*z);
      this.add(objectClone);
    } 
  }


  public setParameters(parameters: ICartesianRepetitionParams | IPolarRepetitionParams) {
    if(!isEqual(parameters,this.parameters)){
      this.clean();
      this.parameters = {...parameters};
      if (this.parameters.type.toLowerCase() === "cartesian") this.cartesianRepetition();
      else if (this.parameters.type.toLowerCase() === "polar") this.polarRepetition();
      else throw new Error('Unknown Repetition Command');
    }
  }

  public clone():RepetitionObject{
    return new RepetitionObject(this.parameters, this.object);
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
      this.add(object);
    } 
  }

  /**
   * Returns the group (instance of ObjectsGroup) of this RepetitionObject, 
   * applying all the operations to children
   */
  public getGroup():ObjectsGroup{
    return new ObjectsGroup(this.unGroup());
  }
}
