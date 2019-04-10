import Object3D from "./Object3D";
import Scene, { IHelperDescription, IObjectPosition } from "./Scene";
import Renderer from "./Renderer";
import STLLoader from "./STLLoader";
import STLObject from "./STLObject";
import {
  IObjectsCommonJSON,
  ICompoundObjectJSON,
  IPrimitiveObjectJSON,
  IViewOptions,
  Operation,
  isTranslateOperation,
  isRotationOperation,
  isScaleOperation,
  isMirrorOperation
} from "./Interfaces";

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

export type IObjectsCommonJSON = IObjectsCommonJSON;
export type ICompoundObjectJSON = ICompoundObjectJSON;
export type IPrimitiveObjectJSON = IPrimitiveObjectJSON;
export type IViewOptions = IViewOptions;
export type IObjectPosition = IObjectPosition;
export type IHelperDescription = IHelperDescription;
export type Operation = Operation;
