import ObjectsCommon, { IObjectsCommonJSON } from './ObjectsCommon';
import Cube, { ICubeJSON } from './Cube';
import Cylinder, { ICylinderJSON } from './Cylinder';
import Sphere, { ISphereJSON } from './Sphere';
import Prism, { IPrismJSON } from './Prism';
import Union from './Union';
import {
  ICompoundObjectJSON,
} from './CompoundObject';
import Difference from './Difference';
import Intersection from './Intersection';

import Scene from './Scene';
import ObjectsGroup, { IObjectsGroupJSON } from './ObjectsGroup';
import RepetitionObject, { IRepetitionObjectJSON } from './RepetitionObject';

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
