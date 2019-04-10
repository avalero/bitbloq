import { IPrimitiveObjectJSON } from "@bitbloq/lib3d";

export interface IShape {
  type: string;
  parameters: object;
  label: string;
  icon: JSX.Element;
}

export interface IShapeGroup {
  label: string;
  icon: JSX.Element;
  shapes: IShape[];
}

export interface IObjectParameter {
  name: string;
  label: string;
  type: string;
  unit?: string;
  minValue?: number;
  maxValue?: number;
  fineStep?: number;
  options?: ISelectOption[];
  isViewOption?: boolean;
  parameters?: IObjectParameter[];
}

export interface IViewOptions {
  name: string;
}

export interface IObjectType {
  name: string;
  label: string;
  icon: JSX.Element;
  canUndo?: boolean;
  undoLabel?: string;
  canUngroup?: boolean;
  withoutColor?: boolean;
  showBaseObject?: boolean;
  canConverToGroup?: boolean;
  parameters?: IObjectParameter[];
  getParameters?: (object: IPrimitiveObjectJSON) => IObjectParameter[];
}

export interface ISelectOption {
  labelId: string;
  value: any;
}

export interface IOperationParameter {
  name?: string;
  label?: string;
  type?: string;
  unit?: string;
  color?: string;
  basicMode?: boolean;
  advancedMode?: boolean;
  basicLabel?: string;
  options?: ISelectOption[];
  getValue?: (operation: any) => any;
  setValue?: (operation: any, value: any) => any;
  activeOperation?: (object: any, operation: any) => any;
  parameters?: IOperationParameter[];
  fineStep?: number;
  minValue?: number;
  maxValue?: number;
}

export interface IOperation {
  name: string;
  label: string;
  basicLabel?: string;
  icon: JSX.Element;
  color?: string;
  create: (children?: any) => any;
  parameters?: IOperationParameter[];
}

export interface ICompositionOperation extends IOperation {
  minObjects?: number;
  maxObjects?: number;
  basicMode?: boolean;
  advancedMode?: boolean;
}
