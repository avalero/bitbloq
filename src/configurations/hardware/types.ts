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

export interface IConnectorPosition {
  x:number;
  y: number;
}

export enum IPortDirection {
  North = "north",
  South = "south",
  East = "east",
  West = "west"
}

export interface IPort {
  name: string;
  position: IConnectorPosition;
  connectorTypes: string[];
  pins: IPortPin[]; 
  placeholderPosition: IConnectorPosition;
  direction: IPortDirection;
}

export interface IComponentImage {
  url: string;
  width: number;
  height: number;
}

export interface IBoard {
  name: string;
  code: IArduinoCode
  image: IComponentImage;
  ports: IPort[];
}