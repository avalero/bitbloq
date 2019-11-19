import Object3D from "./Object3D";
import Scene, {
  IObjectPosition as SceneIObjectPosition,
  IHelperDescription as SceneIHelperDescription
} from "./Scene";
import Renderer from "./Renderer";
import STLLoader from "./STLLoader";
import STLObject from "./STLObject";

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
export type IObjectPosition = SceneIObjectPosition;
export type IHelperDescription = SceneIHelperDescription;
export type Operation = Interfaces.Operation;
