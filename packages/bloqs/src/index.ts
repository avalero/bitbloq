/*
 * File: index.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Bitbloq Repository: https://github.com/bitbloq
 * Bitbloq Team: https://github.com/orgs/Bitbloq/people
 * Copyright 2018 - 2019 BQ Educacion.
 */

import { IMelodyNote } from "@bitbloq/ui";
import HorizontalBloqEditor from "./horizontal/HorizontalBloqEditor";
import HorizontalBloq from "./horizontal/HorizontalBloq";
import BloqsLine from "./horizontal/BloqsLine";
import BloqPlaceholder from "./horizontal/BloqPlaceholder";
import HardwareDesigner from "./hardware/HardwareDesigner";
import bloqs2code from "./bloqs2code/bloqs2code";
import { getBoardDefinition } from "./bloqs2code/board2code";
import { getComponentDefinition } from "./bloqs2code/componentBuilder";
import Web2Board from "./web2board";
import { BloqCategory, BloqParameterType } from "./enums";

export {
  HorizontalBloqEditor,
  HorizontalBloq,
  BloqsLine,
  BloqPlaceholder,
  HardwareDesigner,
  bloqs2code,
  getBoardDefinition,
  getComponentDefinition,
  BloqCategory,
  BloqParameterType,
  Web2Board
};

export interface IBloqBaseParameter {
  name: string;
  label: string;
  type: BloqParameterType;
  value?: string;
  defaultValue?: string | number | boolean;
}

export interface IBloqParameterOption {
  value: string | number | boolean;
  label: string;
}

export interface IBloqSelectParameter extends IBloqBaseParameter {
  options: IBloqParameterOption[];
}

export interface IBloqSelectComponentParameter extends IBloqBaseParameter {
  componentType: string;
}

export type IBloqParameter =
  | IBloqBaseParameter
  | IBloqSelectParameter
  | IBloqSelectComponentParameter;

export function isBloqSelectParameter(
  parameter: IBloqParameter
): parameter is IBloqSelectParameter {
  return parameter.type === BloqParameterType.Select;
}

export function isBloqSelectComponentParameter(
  parameter: IBloqParameter
): parameter is IBloqSelectComponentParameter {
  return parameter.type === BloqParameterType.SelectComponent;
}

export interface IIconSwitch {
  [key: string]: string;
}

export interface IBloqType {
  category: BloqCategory;
  name: string;
  label?: string;
  icon?: string;
  iconSwitch?: IIconSwitch;
  iconComponent?: string;
  code: IArduinoCode;
  parameters?: IBloqParameter[];
  components?: string[];
  configurationComponent?: string;
  genCode?: IArduinoCode;
  conditionCode?: string;
  extends?: string;
  fixed?: boolean;
}

export interface IBloq {
  type: string;
  parameters: { [name: string]: string | number };
}

export interface IBloqLine {
  id: string;
  bloqs: IBloq[];
  disabled?: boolean;
}

export interface IBloqTypeGroup {
  types: string[];
  category?: BloqCategory;
  icon?: string;
}

export interface IShapeProps {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

export type ConnectorType = string;

export interface IArduinoCode {
  defines?: string[];
  includes?: string[];
  globals?: string[];
  setup?: string[];
  loop?: string[];
  endloop?: string[];
  definitions?: string[];
}

export interface IPortPin {
  name: string;
  value: string;
}

export interface IPosition {
  x: number;
  y: number;
}

export interface IConnectorPosition extends IPosition {
  x: number;
  y: number;
  tablet?: IPosition;
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
  schematicPosition: IConnectorPosition;
  schematicPlaceholderPosition: IConnectorPosition;
  width?: number;
  height?: number;
}

interface ISize {
  width: number;
  height: number;
}

export interface IComponentImage extends ISize {
  url: string;
  tablet?: ISize;
}

export interface IIntegratedComponent {
  component: string;
  name: string;
  pins: { [name: string]: string };
}

export interface ILibrary {
  zipURL: string;
  precompiled?: boolean;
}

export interface IBoard {
  name: string;
  label?: string;
  integrated: IIntegratedComponent[];
  code: IArduinoCode;
  image: IComponentImage;
  ports: IPort[];
  schematicCenter: IConnectorPosition;
  schematicImage: IComponentImage;
  snapshotImage: IComponentImage;
  avrgirlBoard?: string;
  borndateBoard?: string;
  libraries?: ILibrary[];
}

export enum ConnectorPinMode {
  INPUT = "INPUT",
  OUTPUT = "OUTPUT",
  I2C = "I2C"
}

export interface IConnectorPin {
  name: string;
  mode: ConnectorPinMode;
  portPin?: string;
}

export interface IConnector {
  name: string;
  type: string;
  position: IConnectorPosition;
  pins: IConnectorPin[];
  direction?: IPortDirection;
}

export interface IComponentAction {
  name: string;
  parameters: string[];
  code: string;
  return?: string;
}

export interface IBloqAction {
  name: string;
  parameters: { [name: string]: string };
}

export interface IComponent {
  name: string;
  label?: string;
  instanceName: string;
  extends: string;
  code: IArduinoCode;
  connectors: IConnector[];
  image: IComponentImage;
  snapshotImage?: IComponentImage;
  libraries?: ILibrary[];
}

export interface IComponentInstance {
  id?: string;
  component: string;
  name: string;
  ports?: { [connectorName: string]: string };
  integrated?: boolean;
  pins?: { [name: string]: string | number };
}

export interface IHardware {
  board: string;
  components: IComponentInstance[];
}

export type IMelody = IMelodyNote[];

export interface IExtraData {
  melodies?: IMelody[];
}
