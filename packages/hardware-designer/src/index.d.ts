export type ConnectorType = string;

export interface IHardwareImage {
  url: string;
  width: number;
  height: number;
}

export interface IConnectorPosition {
  x: number;
  y: number;
}

export interface IPortPin {
  name: string;
  value: any;
}

export enum IPortDirection {
  North = 'north',
  South = 'south',
  East = 'east',
  West = 'west'
}

export interface IPort {
  name: string;
  position: IConnectorPosition;
  connectorTypes: ConnectorType[];
  pins: IPortPin[];
  placeholderPosition: IConnectorPosition;
  direction: IPortDirection;
}

export interface IBoard {
  name: string;
  code: any;
  image: IHardwareImage;
  ports: IPort[];
}

export enum ConnectorPinMode {
  INPUT = "INPUT",
  OUTPUT = "OUTPUT"
}

export interface IConnectorPin {
  name: string;
  mode: ConnectorPinMode;
  portPin: string;
}

export interface IConnector {
  name: string;
  type: ConnectorType;
  position: IConnectorPosition;
  x: number
}

export interface IComponent {
  name: string;
  extends: string;
  image: IHardwareImage;
  code: any;
  connectors: IConnector[];
}
