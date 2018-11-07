import * as THREE from 'three';
import {Object3D, OperationsArray} from './Object3D';
import ObjectsGroup from './ObjectsGroup';
import { resolve } from 'url';


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

export default class RepetitionObject{

  public static typeName:string = 'RepetitionObject';

  private group: ObjectsGroup;
  private object: Object3D;
  private parameters: ICartesianRepetitionParams | IPolarRepetitionParams;

  constructor(params: ICartesianRepetitionParams | IPolarRepetitionParams, object: Object3D){
    this.parameters = {...params}
    this.group = new ObjectsGroup();
    if (this.parameters.type === "Cartesian") this.cartesianRepetition();
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
   * Returns the group of the repetition Object
   */
  public getGroup():ObjectsGroup{
    return this.group;
  }

  public async getMeshAsync(): Promise<THREE.Group> {
    return this.group.getMeshAsync();
  }

}