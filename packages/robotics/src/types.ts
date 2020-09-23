export enum BloqCategory {
  Component = "component",
  Functions = "functions",
  Variables = "variables",
  Code = "code",
  Math = "math",
  Text = "text",
  Control = "control",
  Logic = "logic"
}

export enum InstructionType {
  Block = "block",
  Parameter = "parameter",
  Statement = "statement"
}

export interface IBloqUILabel {
  type: "label";
  text: string;
}

export interface IBloqUISelectOption {
  value: any;
  label: string;
}

export interface IBloqUISelect {
  type: "select";
  parameterName: string;
  options: IBloqUISelectOption[];
}

type IBloqUIElement = IBloqUILabel | IBloqUISelect;

export interface IBloqType {
  name: string;
  instructionType: InstructionType;
  category: BloqCategory;
  uiElements: IBloqUIElement[];
}

export interface IBloq {
  type: string;
  children?: IBloq[];
}
