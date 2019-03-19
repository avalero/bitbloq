export enum BloqCategory {
  Event = "event",
  Timer = "timer",
  Action = "action"
}

export interface BloqCode {
  declaration?: string;
  definition?: string;
  setup?: string;
  statement?: string;
}

export enum BloqParameterType {
  Select = "select",
  Number = "number"
}

export interface BloqParameterOption {
  value: any;
  label: string;
}

export interface BloqParameterOptionSource {
  source: string;
  args: string[];
}

export interface BloqParameterDefinition {
  name: string;
  label: string;
  type: BloqParameterType;
  options: BloqParameterOption | BloqParameterOptionSource
}

export interface BloqType {
  category: BloqCategory;
  name: string;
  label: string;
  icon: string;
  code: BloqCode;
  parameterDefinitions: BloqParameterDefinition[];
}

export interface Bloq {
  type: string;
  parameters: any[];
}

export interface BloqTypeGroup {
  category: BloqCategory;
  types: string[];
  icon: string;
}

export interface ShapeProps {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}
