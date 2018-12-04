import uuid from 'uuid/v1';
import isEqual from 'lodash.isequal';

interface ICommonOperation {
  type: string;
  id?: string;
}

export interface IObjectsCommonJSON {
  type: string;
  id: string;
  viewOptions: Partial<IViewOptions>;
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

export type Operation =
  | ITranslateOperation
  | IRotateOperation
  | IScaleOperation
  | IMirrorOperation;
export type OperationsArray = Array<Operation>;

export interface IViewOptions {
  color: string;
  visible: boolean;
  highlighted: boolean;
  opacity: number;
  name: string;
}

export default class ObjectsCommon {
  public static createViewOptions(
    color: string = '#ffffff',
    visible: boolean = true,
    highlighted: boolean = false,
    name: string = '',
    opacity: number = 100,
  ): IViewOptions {
    return {
      color,
      visible,
      highlighted,
      name,
      opacity,
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
      id: uuid(),
    };
  }

  public static createMirrorOperation(
    plane: string = 'yz', //xy, yz, zx
  ): IMirrorOperation {
    return {
      type: 'mirror',
      plane,
      id: uuid(),
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
      id: uuid(),
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
      id: uuid(),
    };
  }

  protected operations: OperationsArray;
  protected _pendingOperation: boolean;
  protected _meshUpdateRequired: boolean;
  protected viewOptions: IViewOptions;
  protected id: string;
  protected type: string;
  protected _viewOptionsUpdateRequired: boolean;

  constructor(
    viewOptions: IViewOptions = ObjectsCommon.createViewOptions(),
    operations: OperationsArray = [],
  ) {
    this._pendingOperation = false;
    this._meshUpdateRequired = false;
    this.setOperations(operations);
    this.setViewOptions(viewOptions);
    //each new object must have a new ID
    this.id = uuid();
  }

  get meshUpdateRequired(): boolean {
    return this._meshUpdateRequired;
  }

  get pendingOperation(): boolean {
    return this._pendingOperation;
  }

  public getID() {
    return this.id;
  }

  public getOperations(): OperationsArray {
    return this.operations;
  }

  public setOperations(operations: OperationsArray = []): void {
    if (!this.operations || this.operations.length === 0) {
      this.operations = operations.slice(0);
      if (operations.length > 0) this._pendingOperation = true;
      return;
    }

    if (!isEqual(this.operations, operations)) {
      this.operations = operations.slice();
      this._pendingOperation = true;
    }

    this._pendingOperation =
      this.pendingOperation || !isEqual(this.operations, operations);
  }

  public addOperations(operations: OperationsArray = []): void {
    this.setOperations(this.operations.concat(operations));
  }

  public translate(
    x: number,
    y: number,
    z: number,
    relative: boolean = false,
  ): void {
    this.addOperations([
      ObjectsCommon.createTranslateOperation(x, y, z, relative),
    ]);
  }

  public rotateX(angle: number, relative: boolean = false): void {
    this.addOperations([
      ObjectsCommon.createRotateOperation('x', angle, relative),
    ]);
  }

  public rotateY(angle: number, relative: boolean = false): void {
    this.addOperations([
      ObjectsCommon.createRotateOperation('y', angle, relative),
    ]);
  }

  public rotateZ(angle: number, relative: boolean = false): void {
    this.addOperations([
      ObjectsCommon.createRotateOperation('z', angle, relative),
    ]);
  }

  public scale(x: number, y: number, z: number): void {
    this.addOperations([ObjectsCommon.createScaleOperation(x, y, z)]);
  }

  public mirror(plane: string): void {
    this.addOperations([ObjectsCommon.createMirrorOperation(plane)]);
  }

  public getMeshAsync(): Promise<THREE.Object3D> {
    throw new Error('ObjectsCommon.getMeshAsyinc() implemented in children');
  }

  public setViewOptions(params: Partial<IViewOptions>) {
    if(!isEqual(params,this.viewOptions)){
      this.viewOptions = {
        ...ObjectsCommon.createViewOptions(),
        ...this.viewOptions,
        ...params,
      }
      this._viewOptionsUpdateRequired =true;
    }
  }

  public get viewOptionsUpdateRequired():boolean{
    return this._viewOptionsUpdateRequired;
  }

  public clone(): ObjectsCommon {
    throw new Error('ObjectsCommon.clone() Implemented in children');
  }

  public getTypeName(): string {
    return this.type;
  }

  public toJSON(): IObjectsCommonJSON {
    return {
      id: this.id,
      type: this.type,
      viewOptions: this.viewOptions,
      operations: this.operations,
    };
  }

  public updateFromJSON(object: IObjectsCommonJSON): void {
    throw new Error('updateFromJSON() Implemented in children');
  }

}
