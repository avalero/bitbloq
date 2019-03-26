export interface IArduinoCode {
  includes?: string[];
  globals?: string[];
  setup?: string[];
  loop?: string[];
  definitions?: string[];
}

export interface IPortPin {
  name: string;
  value: number | string;
}

export type ConnectorType = string;

export interface IPort {
  name: string;
  connectorTypes: ConnectorType[];
  pins: IPortPin[]; 
}

export interface IBoard {
  name: string;
  code: IArduinoCode;
  ports: IPort[];
}