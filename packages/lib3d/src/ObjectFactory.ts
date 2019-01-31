import {
  IRepetitionObjectJSON,
  IObjectsGroupJSON,
  ITextObjectJSON,
  ICompoundObjectJSON,
  ICubeJSON,
  ICylinderJSON,
  IObjectsCommonJSON,
  IPrismJSON,
  IPyramidJSON,
  ISphereJSON,
  ISTLJSON,
} from './Interfaces';
import Cube from './Cube';
import Cylinder from './Cylinder';
import Difference from './Difference';
import Intersection from './Intersection';
import ObjectsCommon from './ObjectsCommon';
import Prism from './Prism';
import TextObject from './TextObject';
import Pyramid from './Pyramid';
import Sphere from './Sphere';
import Union from './Union';

import ObjectsGroup from './ObjectsGroup';
import RepetitionObject from './RepetitionObject';
import Scene from './Scene';
import STLObject from './STLObject';

export default class ObjectFactory {
  /**
   * Creates a new Primitive Object from its JSON
   * @param json object toJSON
   */
  public static newFromJSON(
    obj: IObjectsCommonJSON,
    scene: Scene,
  ): ObjectsCommon {
    switch (obj.type) {
      case Cube.typeName:
        return Cube.newFromJSON(obj as ICubeJSON);
      case Cylinder.typeName:
        return Cylinder.newFromJSON(obj as ICylinderJSON);
      case Sphere.typeName:
        return Sphere.newFromJSON(obj as ISphereJSON);
      case Prism.typeName:
        return Prism.newFromJSON(obj as IPrismJSON);
      case Pyramid.typeName:
        return Pyramid.newFromJSON(obj as IPyramidJSON);
      case STLObject.typeName:
        return STLObject.newFromJSON(obj as ISTLJSON);
      case TextObject.typeName:
        return TextObject.newFromJSON(obj as ITextObjectJSON);
      case ObjectsGroup.typeName:
        return ObjectsGroup.newFromJSON(obj as IObjectsGroupJSON, scene);
      case RepetitionObject.typeName:
        return RepetitionObject.newFromJSON(
          obj as IRepetitionObjectJSON,
          scene,
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
