import uuid from 'uuid/v1';

interface ICommonOperation {
  type: string;
}

export interface IObjectsCommonJSON{
  type: string;
  id: string;
  viewOptions: IViewOptions;
  operations: OperationsArray;
}

export interface ITranslateOperation extends ICommonOperation {
  x: number;
  y: number;
  z: number;
  relative: boolean;
}

export interface IRotateOperation extends ICommonOperation {
  axis: string;
  angle: number;
  relative: boolean;
}

export interface IScaleOperation extends ICommonOperation {
  x: number;
  y: number;
  z: number;
}

export interface IMirrorOperation extends ICommonOperation {
  plane: string;
}

export type Operation = ITranslateOperation | IRotateOperation | IScaleOperation | IMirrorOperation ;
export type OperationsArray = Array<Operation>;

export interface IViewOptions{
  color: string;
  visible: boolean;
  highlighted: boolean;
  name: string;
}

export default class ObjectsCommon{

  public static createViewOptions(
    color: string = '#ffffff', 
    visible :boolean = true, 
    highlighted: boolean = false,
    name:string = ''): IViewOptions{
      return {
        color, visible, highlighted, name
      };
  }

  public static createTranslateOperation(
    x: number = 0,
    y: number = 0,
    z: number = 0,
    relative: boolean = true,
  ): ITranslateOperation {
    return {
      type: 'translation',
      x,
      y,
      z,
      relative,
    };
  }

  public static createMirrorOperation(
    plane: string = 'yz', //xy, yz, zx
  ): IMirrorOperation {
    return {
      type: 'mirror',
      plane,
    };
  }

  public static createRotateOperation(
    axis: string = 'x',
    angle: number = 0,
    relative: boolean = true,
  ): IRotateOperation {
    return {
      type: 'rotation',
      axis,
      angle,
      relative,
    };
  }

  public static createScaleOperation(
    x: number = 1,
    y: number = 1,
    z: number = 1,
  ): IScaleOperation {
    return {
      type: 'scale',
      x,
      y,
      z,
    };
  }

  protected operations: OperationsArray;
  protected _pendingOperation: boolean;
  protected viewOptions: IViewOptions;
  protected id: string;
  protected type:string;

  constructor(
    viewOptions: IViewOptions = ObjectsCommon.createViewOptions(), 
    operations: OperationsArray = []
    ) 
  {
    this.setOperations(operations);
    this.setViewOptions(viewOptions);
    //each new object must have a new ID
    this.id = uuid();
  }

  public getID(){
    return this.id;
  }
 
  public getOperations():OperationsArray{
    return this.operations;
  }

  public setOperations(operations: OperationsArray = []): void {
    throw new Error('ObjectsCommon.setOperations() Implemented on children');
  }

  public addOperations(operations: OperationsArray = []): void {
    this.setOperations(this.operations.concat(operations));
  }

  public translate(x:number, y:number, z:number, relative:boolean = false): void {
    this.addOperations([ObjectsCommon.createTranslateOperation(x,y,z,relative)]);
  }

  public rotateX(angle:number, relative:boolean = false):void{
    this.addOperations([ObjectsCommon.createRotateOperation('x', angle, relative)]);
  }

  public rotateY(angle:number, relative:boolean = false):void{
    this.addOperations([ObjectsCommon.createRotateOperation('y', angle, relative)]);
  }

  public rotateZ(angle:number, relative:boolean = false):void{
    this.addOperations([ObjectsCommon.createRotateOperation('z', angle, relative)]);
  }

  public scale(x:number, y:number, z:number):void{
    this.addOperations([ObjectsCommon.createScaleOperation(x,y,z)]);
  }

  public mirror(plane: string): void {
    this.addOperations([ObjectsCommon.createMirrorOperation(plane)]);
  }

  public getMeshAsync():Promise<THREE.Object3D> {
    throw new Error('ObjectsCommon.getMeshAsyinc() implemented in children')
  }

  public setViewOptions(params: IViewOptions){
    this.viewOptions = {...params};
  }

  public clone():ObjectsCommon{
    throw new Error('ObjectsCommon.clone() Implemented in children');
  }

  public getTypeName(): string{
    return this.type;
  }

  public toJSON():IObjectsCommonJSON{
    throw new Error('toJSON() Implemented in children');
  }

  public updateFromJSON(object: IObjectsCommonJSON):void{
    throw new Error('updateFromJSON() Implemented in children');
  }
}