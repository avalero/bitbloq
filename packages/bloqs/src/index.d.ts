import HorizontalBloqEditor from "./horizontal/HorizontalBloqEditor";
import HardwareDesigner from "./hardware/HardwareDesigner";
import bloqs2code from "./bloqs2code/bloqs2code";

export { HorizontalBloqEditor, HardwareDesigner, bloqs2code };

export enum BloqCategory {
  Event = "event",
  Wait = "wait",
  Action = "action"
}

export interface IBloqCode {
  declaration?: string;
  definition?: string;
  setup?: string;
  statement?: string;
}

export enum BloqParameterType {
  Select = "select",
  Number = "number"
}

export interface IBloqParameterOption {
  value: any;
  label: string;
}

export interface IBloqParameterOptionSource {
  source: string;
  args: string[];
}

export interface IBloqParameterDefinition {
  name: string;
  label: string;
  type: BloqParameterType;
  options: IBloqParameterOption | IBloqParameterOptionSource;
}

export interface IBloqType {
  category: BloqCategory;
  name: string;
  label?: string;
  icon: string;
  code: IBloqCode;
  parameterDefinitions: IBloqParameterDefinition[];
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
