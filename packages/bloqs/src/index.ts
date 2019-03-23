import HorizontalBloqEditor from "./horizontal/HorizontalBloqEditor";
import HardwareDesigner from "./hardware/HardwareDesigner";
import bloqs2code from "./bloqs2code/bloqs2code";
import { BloqCategory, BloqParameterType } from "./enums"

export { HorizontalBloqEditor, HardwareDesigner, bloqs2code };

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
  value: any;
  label: string;
}

export interface IBloqSelectParameter
  extends IBloqBaseParameter {
  options: IBloqParameterOption[];
}

export interface IBloqSelectComponentParameter
  extends IBloqBaseParameter {
  componentType: string;
}

export type IBloqParameter =
  | IBloqBaseParameter
  | IBloqSelectParameter
  | IBloqSelectComponentParameter;

export function isBloqSelectParameter(parameter: IBloqParameter): parameter is IBloqSelectParameter {
  return parameter.type === BloqParameterType.Select;
}

export function isBloqSelectComponentParameter(parameter: IBloqParameter): parameter is IBloqSelectComponentParameter {
  return parameter.type === BloqParameterType.SelectComponent;
}

export interface IBloqType {
  category: BloqCategory;
  name: string;
  label?: string;
  icon: string;
  code: IBloqCode;
  parameterDefinitions: IBloqParameter[];
}

export interface IBloq {
  type: string;
  parameters: any[];
}

export interface IBloqTypeGroup {
  category: BloqCategory;
  types: string[];
  icon: string;
}

export interface IShapeProps {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

export type ConnectorType = string;

export interface IComponentImage {
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
  North = "north",
  South = "south",
  East = "east",
  West = "west"
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
  image: IComponentImage;
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
  x: number;
}

export interface IComponent {
  name: string;
  extends: string;
  image: IComponentImage;
  code: any;
  connectors: IConnector[];
  instanceName: string;
}

export interface IComponentInstance {
  component: string;
  name: string;
  port: string;
}

export interface IHardware {
  board: string;
  components: IComponentInstance[];
}
