/*
 * File: Interfaces.ts
 * Project: Bitbloq
 * File Created: Monday, 25th February 2019
 * Last Modified:: Monday, 25th February 2019 9:56:35 am
 * -----
 * Author: David García (david.garciaparedes@bq.com)
 * Author: Alda Martín (alda.marting@bq.com)
 * Author: Alberto Valero (alberto.valero@bq.com)
 * -----
 * Copyright 2018 - 2019 BQ Educacion.
 */

export interface IObjectsCommonJSON {
  type: string;
  id: string;
  viewOptions: Partial<IViewOptions>;
  operations: OperationsArray;
  mesh?: object;
  geometry?: {
    id: string;
    vertices: number[];
    normals: number[];
  };
}

export interface IGeometry {
  id: string;
  vertices: number[];
  normals: number[];
}

interface ICommonOperation {
  type: string;
  id?: string;
}

export interface ITranslateOperation extends ICommonOperation {
  x: number;
  y: number;
  z: number;
  relative: boolean;
}

export interface IRotateOperation extends ICommonOperation {
  x: number;
  y: number;
  z: number;
  relative: boolean;
}

export interface IScaleOperation extends ICommonOperation {
  x: number;
  y: number;
  z: number;
}

export interface IMirrorOperation extends ICommonOperation {
  plane: string;
}

export type Operation =
  | ITranslateOperation
  | IRotateOperation
  | IScaleOperation
  | IMirrorOperation;

export type OperationsArray = Operation[];

export interface IViewOptions {
  color: string;
  visible: boolean;
  selected: boolean;
  opacity: number;
  name: string;
}

// Compound Object

export interface ICompoundObjectJSON extends IObjectsCommonJSON {
  children: IObjectsCommonJSON[];
}

// Primitive Object

export interface IPrimitiveObjectJSON extends IObjectsCommonJSON {
  parameters: object;
}

// Cube

export interface ICubeParams {
  width: number;
  depth?: number;
  height?: number;
}

export interface ICubeJSON extends IPrimitiveObjectJSON {
  parameters: ICubeParams;
}

// RectPrism
export interface IRectPrismParams {
  width: number;
  depth: number;
  height: number;
}

export interface IRectPrismJSON extends IPrimitiveObjectJSON {
  parameters: IRectPrismParams;
}

// Cylinder
export interface ICylinderParams {
  r0: number;
  r1?: number;
  height: number;
}

export interface ICylinderJSON extends IPrimitiveObjectJSON {
  parameters: ICylinderParams;
}

// Truncated Cone
export interface ITruncatedConeParams {
  r0: number;
  r1: number;
  height: number;
}

export interface ITruncatedConeJSON extends IPrimitiveObjectJSON {
  parameters: ITruncatedConeParams;
}

// Tube
export interface ITubeParams {
  r0: number;
  r1: number;
  height: number;
}

export interface ITubeJSON extends IPrimitiveObjectJSON {
  parameters: ITubeParams;
}

// Star
export interface IStarParams {
  r0: number;
  r1: number;
  height: number;
  peaks: number;
}

export interface IStarJSON extends IPrimitiveObjectJSON {
  parameters: IStarParams;
}

// Cone
export interface IConeParams {
  r0: number;
  height: number;
}

export interface IConeJSON extends IPrimitiveObjectJSON {
  parameters: IConeParams;
}

// Torus
export interface ITorusParams {
  r0: number;
  r1: number;
}

export interface ITorusJSON extends IPrimitiveObjectJSON {
  parameters: ITorusParams;
}

// Prism
export interface IPrismParams {
  sides: number;
  length: number;
  height: number;
}

export interface IPrismJSON extends IObjectsCommonJSON {
  parameters: IPrismParams;
}

// Pyramid
export interface IPyramidParams {
  sides: number;
  length: number;
  height: number;
}

export interface IPyramidJSON extends IObjectsCommonJSON {
  parameters: IPyramidParams;
}

// Sphere
export interface ISphereParams {
  radius: number;
}

export interface ISphereJSON extends IObjectsCommonJSON {
  parameters: ISphereParams;
}

// STL Object
export interface ISTLParams {
  url?: string;
  blob?: {
    uint8Data: Uint8Array | number[];
    filetype: string;
    newfile: boolean;
  };
}

// TEXT Object

export interface ITextObjectParams {
  text: string;
  thickness: number;
  size: number;
  font: string;
}

export interface ITextObjectJSON extends IObjectsCommonJSON {
  parameters: ITextObjectParams;
}

export interface ISTLJSON extends IObjectsCommonJSON {
  parameters: ISTLParams;
}

// Repetition

export interface IRepetitionObjectJSON extends IObjectsCommonJSON {
  parameters: ICartesianRepetitionParams | IPolarRepetitionParams;
  children: IObjectsCommonJSON[];
}

export interface IRepetitionParams {
  num: number;
  type: string;
}

export interface ICartesianRepetitionParams extends IRepetitionParams {
  type: 'cartesian';
  x: number;
  y: number;
  z: number;
}

export interface IPolarRepetitionParams extends IRepetitionParams {
  type: 'polar';
  angle: number;
  axis: string;
}

// Objects Group

export interface IObjectsGroupJSON extends IObjectsCommonJSON {
  children: IObjectsCommonJSON[];
}
