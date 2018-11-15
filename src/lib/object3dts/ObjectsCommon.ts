interface ICommonOperation {
  type: string;
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

export interface IColorOperation extends ICommonOperation {
  color:string;
}

export type Operation = ITranslateOperation | IRotateOperation | IScaleOperation | IMirrorOperation | IColorOperation;
export type OperationsArray = Array<Operation>;

export default class ObjectsCommon{

  public static createColorOperation(
    color: string = "ffffff",
  ): IColorOperation {
    return {
      type: 'color',
      color,
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

  constructor(operations: OperationsArray = []) {
    this.operations = operations;
    this._pendingOperation = true;
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

  public translate(x:number, y:number, z:number, relative:boolean = false):void{
    this.addOperations([
      {
        type: 'translation',
        x,
        y,
        z,
        relative,
      }]);
  }

  public getMeshAsync():Promise<THREE.Object3D> {
    throw new Error('ObjectsCommon.getMeshAsyinc() implemented in children')
  }

  public clone():ObjectsCommon{
    throw new Error('ObjectsCommon.clone() Implemented in children');
  }
}