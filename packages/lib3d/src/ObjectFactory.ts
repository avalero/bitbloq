import {
  IRepetitionObjectJSON,
  IObjectsGroupJSON,
  ITextObjectJSON,
  ICompoundObjectJSON,
  ICubeJSON,
  IRectPrismJSON,
  ICylinderJSON,
  IConeJSON,
  IObjectsCommonJSON,
  IPrismJSON,
  IPyramidJSON,
  ISphereJSON,
  ISTLJSON,
  ITruncatedConeJSON,
  ITorusJSON,
  ITubeJSON,
  IStarJSON,
} from './Interfaces';
import Cube from './Cube';
import RectPrism from './RectPrism';
import Cylinder from './Cylinder';
import SemiCylinder from './SemiCylinder';
import Tube from './Tube';
import TruncatedCone from './TruncatedCone';
import Difference from './Difference';
import Intersection from './Intersection';
import ObjectsCommon from './ObjectsCommon';
import Prism from './Prism';
import TextObject from './TextObject';
import Pyramid from './Pyramid';
import Sphere from './Sphere';
import Union from './Union';
import Cone from './Cone';
import Torus from './Torus';
import Star from './Star';

import ObjectsGroup from './ObjectsGroup';
import RepetitionObject from './RepetitionObject';
import Scene from './Scene';
import STLObject from './STLObject';
import PredesignedObject from './PredesignedObject';

export default class ObjectFactory {
  /**
   * Creates a new Primitive Object from its JSON
   * @param json object toJSON
   */
  public static newFromJSON(
    obj: IObjectsCommonJSON,
    scene: Scene
  ): ObjectsCommon {
    switch (obj.type) {
      case Cube.typeName:
        // legacy fix
        // Cubes had originally three parameters, now they have one.
        // Cube with 3 parameters is a RectPrism
        const auxCubeJSON: ICubeJSON = obj as ICubeJSON;
        const width = auxCubeJSON.parameters.width;
        const depth = auxCubeJSON.parameters.depth || 0;
        const height = auxCubeJSON.parameters.height || 0;

        if (width === height && height === depth) {
          delete auxCubeJSON.parameters.depth;
          delete auxCubeJSON.parameters.height;
          return Cube.newFromJSON(obj as ICubeJSON);
        }

        // It is a Rectangular Prism
        obj.type = RectPrism.typeName;
        return RectPrism.newFromJSON(obj as IRectPrismJSON);
      case RectPrism.typeName:
        return RectPrism.newFromJSON(obj as IRectPrismJSON);
      case Cylinder.typeName:
        // legacy fix
        // Cylinders had originally top radius and bottom radius now they have one.
        // Cylinders with top and bottom radius are a RectPrism

        const auxCylJSON = obj as ICylinderJSON;
        const r0 = auxCylJSON.parameters.r0;
        const r1 = auxCylJSON.parameters.r1 || -1;
        const cylHeight = auxCylJSON.parameters.height;

        // pure cylinder
        if (r0 === r1) {
          delete auxCylJSON.parameters.r1;
          return Cylinder.newFromJSON(obj as ICylinderJSON);
        }

        if (r1 === 0) {
          delete auxCylJSON.parameters.r1;
          return Cone.newFromJSON(obj as IConeJSON);
        }
        // Truncated Cone
        return TruncatedCone.newFromJSON(obj as ITruncatedConeJSON);
      case TruncatedCone.typeName:
        return TruncatedCone.newFromJSON(obj as ITruncatedConeJSON);
      case Star.typeName:
        return Star.newFromJSON(obj as IStarJSON);
      case SemiCylinder.typeName:
        return SemiCylinder.newFromJSON(obj as ICylinderJSON);
      case Cone.typeName:
        return Cone.newFromJSON(obj as IConeJSON);
      case Sphere.typeName:
        return Sphere.newFromJSON(obj as ISphereJSON);
      case Torus.typeName:
        return Torus.newFromJSON(obj as ITorusJSON);
      case Prism.typeName:
        return Prism.newFromJSON(obj as IPrismJSON);
      case Tube.typeName:
        return Tube.newFromJSON(obj as ITubeJSON);
      case Pyramid.typeName:
        return Pyramid.newFromJSON(obj as IPyramidJSON);
      case STLObject.typeName:
        return STLObject.newFromJSON(obj as ISTLJSON);
      case PredesignedObject.typeName:
        return PredesignedObject.newFromJSON(obj as ISTLJSON);
      case TextObject.typeName:
        return TextObject.newFromJSON(obj as ITextObjectJSON);
      case ObjectsGroup.typeName:
        return ObjectsGroup.newFromJSON(obj as IObjectsGroupJSON, scene);
      case RepetitionObject.typeName:
        return RepetitionObject.newFromJSON(
          obj as IRepetitionObjectJSON,
          scene
        );
      case Union.typeName:
        return Union.newFromJSON(obj as ICompoundObjectJSON, scene);
      case Difference.typeName:
        return Difference.newFromJSON(obj as ICompoundObjectJSON, scene);
      case Intersection.typeName:
        return Intersection.newFromJSON(obj as ICompoundObjectJSON, scene);
    }

    throw new Error('Unknown Primitive Object Type');
  }
}
