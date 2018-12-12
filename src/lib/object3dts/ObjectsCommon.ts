import uuid from 'uuid/v1';
import isEqual from 'lodash.isequal';

import cloneDeep from 'lodash.clonedeep';

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
  x: number;
  y: number;
  z: number;
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
    x: number = 0,
    y: number = 0,
    z: number = 0,
    relative: boolean = true,
  ): IRotateOperation {
    return {
      type: 'rotation',
      x,
      y,
      z,
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
  protected lastJSON: IObjectsCommonJSON;
  protected parent: ObjectsCommon | undefined;
  protected meshPromise: Promise<THREE.Mesh | THREE.Group> | null;
  protected mesh: THREE.Mesh | THREE.Group;

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
    this.parent = undefined;
  }

  public async getMeshAsync(): Promise<THREE.Mesh | THREE.Group> {
    if (this.meshPromise) {
      this.mesh = await this.meshPromise;
      this.meshPromise = null;
      return this.mesh;
    } else {
      return this.mesh;
    }
  }

  public async computeMeshAsync(): Promise<THREE.Mesh | THREE.Group> {
    throw new Error('Object3D.computeMeshAsync() implemented on children');
  }

  public setParent(object: ObjectsCommon): void {
    this.parent = object;
  }

  public getParent(): ObjectsCommon | undefined {
    return this.parent;
  }

  set meshUpdateRequired(a: boolean) {
    this._meshUpdateRequired = a;
  }

  get meshUpdateRequired(): boolean {
    return this._meshUpdateRequired;
  }

  set pendingOperation(a: boolean) {
    this._pendingOperation = a;
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

  protected setOperations(operations: OperationsArray = []): void {
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
    this.setOperations([...this.operations, ...operations]);
  }
  
  protected translate(
    x: number,
    y: number,
    z: number,
    relative: boolean = false,
  ): void {
    this.addOperations([
      ObjectsCommon.createTranslateOperation(x, y, z, relative),
    ]);
  }

  protected rotateX(angle: number, relative: boolean = false): void {
    this.addOperations([
      ObjectsCommon.createRotateOperation(angle, 0, 0, relative),
    ]);
  }

  protected rotateY(angle: number, relative: boolean = false): void {
    this.addOperations([
      ObjectsCommon.createRotateOperation(0, angle, 0, relative),
    ]);
  }

  protected rotateZ(angle: number, relative: boolean = false): void {
    this.addOperations([
      ObjectsCommon.createRotateOperation(0, 0, angle, relative),
    ]);
  }

  public scale(x: number, y: number, z: number): void {
    this.addOperations([ObjectsCommon.createScaleOperation(x, y, z)]);
  }

  public mirror(plane: string): void {
    this.addOperations([ObjectsCommon.createMirrorOperation(plane)]);
  }

  get computedMesh(): THREE.Group | THREE.Mesh | undefined {
    return this.mesh;
  }

  public setViewOptions(params: Partial<IViewOptions>) {
    if (!isEqual(params, this.viewOptions)) {
      this.viewOptions = {
        ...ObjectsCommon.createViewOptions(),
        ...this.viewOptions,
        ...params,
      };
      this._viewOptionsUpdateRequired = true;
    }
  }

  public get viewOptionsUpdateRequired(): boolean {
    return this._viewOptionsUpdateRequired;
  }

  public clone(): ObjectsCommon {
    throw new Error('ObjectsCommon.clone() Implemented in children');
  }

  public getTypeName(): string {
    return this.type;
  }

  public toJSON(): IObjectsCommonJSON {
    return cloneDeep({
      id: this.id,
      type: this.type,
      viewOptions: this.viewOptions,
      operations: this.operations,
    });
  }

  public updateFromJSON(object: IObjectsCommonJSON): void {
    throw new Error('updateFromJSON() Implemented in children');
  }
}
