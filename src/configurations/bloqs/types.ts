
export enum BloqCategory {
  Event = "event",
  Wait = "wait",
  Action = "action"
}

export enum BloqParameterType {
  Select = "select",
  SelectComponent = "selectComponent",
  Number = "number",
  Text = "text"
}

export interface IIconSwitch {
  [key: string]: string;
}

export interface IBloqCode {
  declaration?: string;
  definition?: string;
  setup?: string;
  statement?: string;
}

export interface IBloqBaseParameter {
  name: string;
  label: string;
  type: BloqParameterType;
}

export interface IBloqParameterOption {
  value: string | boolean | number;
  label: string;
}

export interface IBloqSelectParameter extends IBloqBaseParameter {
  options: IBloqParameterOption[];
}

export interface IBloqSelectComponentParameter extends IBloqBaseParameter {
  componentType: string;
}

export type IBloqParameter =
  | IBloqBaseParameter
  | IBloqSelectParameter
  | IBloqSelectComponentParameter;

export interface IBloqType {
  category: BloqCategory;
  name: string;
  label?: string;
  icon?: string;
  iconSwitch?: IIconSwitch;
  iconComponent?: string;
  code: IBloqCode;
  parameters: IBloqParameter[];
  components?: string[];
}

export interface IBloq {
  type: string;
  parameters: { [name: string]: string };
}

export interface IBloqTypeGroup {
  types: string[];
  category?: BloqCategory;
  icon?: string;
}