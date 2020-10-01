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
  value: string | number;
  label: string;
}

export interface IBloqUISelect {
  type: "select";
  parameterName: string;
  options: IBloqUISelectOption[];
}

export interface IBloqUIParameter {
  type: "parameter";
  parameterName: string;
}

type IBloqUIElement = IBloqUILabel | IBloqUISelect | IBloqUIParameter;

export interface IBloqCode {
  main?: string;
}

export interface IBloqType {
  name: string;
  instructionType: InstructionType;
  category: BloqCategory;
  uiElements: IBloqUIElement[];
  forComponents?: string[];
  code?: IBloqCode;
}

export interface IBloq {
  type: string;
  children?: IBloq[];
  parameters?: Record<string, string | number | IBloq>;
}
