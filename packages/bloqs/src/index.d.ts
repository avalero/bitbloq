export enum BloqCategory {
  Event = 'event',
  Timer = 'timer',
  Action = 'action'
}

export interface BloqCode {
  declaration?: string;
  definition?: string;
  setup?: string;
  statement?: string;
}

export interface BloqType {
  category: BloqCategory;
  name: string;
  icon: string;
  code: BloqCode;
}

export interface Bloq {
  type: string;
  parameters: any[];
}

export interface BloqTypeGroup{
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
