import Object3D from "./Object3D";
import * as Scene from "./Scene";
import Renderer from "./Renderer";
import STLLoader from "./STLLoader";
import STLObject from "./STLObject";
// import {
//   IObjectsCommonJSON,
//   ICompoundObjectJSON,
//   IPrimitiveObjectJSON,
//   IViewOptions,
//   Operation,
//   isTranslateOperation,
//   isRotationOperation,
//   isScaleOperation,
//   isMirrorOperation
// } from "./Interfaces";

import * as Interfaces from "./Interfaces";

const isTranslateOperation = Interfaces.isTranslateOperation;
const isRotationOperation = Interfaces.isRotationOperation;
const isScaleOperation = Interfaces.isScaleOperation;
const isMirrorOperation = Interfaces.isMirrorOperation;

export {
  Object3D,
  Scene,
  Renderer,
  STLLoader,
  STLObject,
  isTranslateOperation,
  isRotationOperation,
  isScaleOperation,
  isMirrorOperation
};

export type IObjectsCommonJSON = Interfaces.IObjectsCommonJSON;
export type ICompoundObjectJSON = Interfaces.ICompoundObjectJSON;
export type IPrimitiveObjectJSON = Interfaces.IPrimitiveObjectJSON;
export type IViewOptions = Interfaces.IViewOptions;
export type IObjectPosition = Scene.IObjectPosition;
export type IHelperDescription = Scene.IHelperDescription;
export type Operation = Interfaces.Operation;
