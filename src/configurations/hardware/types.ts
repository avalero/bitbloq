export interface IArduinoCode {
  includes?: string[];
  globals?: string[];
  setup?: string[];
  loop?: string[];
  definitions?: string[];
}

export interface IPortPin {
  name: string;
  value: string;
}

export type ConnectorType = string;

export interface IConnectorPosition {
  x: number;
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
  code: IArduinoCode;
  image: IComponentImage;
  ports: IPort[];
}

export enum ConnectorPinMode {
  INPUT = "INPUT",
  OUTPUT = "OUTPUT",
  I2C = "I2C"
}

export interface IConnectorPin {
  name: string;
  mode: ConnectorPinMode;
  portPin: string;
}

export interface IConnector {
  name: string;
  type: string;
  position: IConnectorPosition;
  pins: IConnectorPin[];
}

export interface IComponentAction {
  name: string;
  parameters: string[];
  code: string;
  returns?: string;
}

export interface IComponent {
  name: string;
  instanceName: string;
  extends: string;
  code: IArduinoCode;
  actions: IComponentAction[];
  connectors: IConnector[];
  image: IComponentImage;
  onValue?: string;
  offValue?: string;
  values: {[name:string]:string | boolean | number};
}
