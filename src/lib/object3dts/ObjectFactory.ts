import ObjectsCommon, { IObjectsCommonJSON } from './ObjectsCommon';
import Object3D from './Object3D';
import Cube, { ICubeJSON } from './Cube';
import Cylinder, { ICylinderJSON } from './Cylinder';
import Sphere, { ISphereJSON } from './Sphere';
import Prism, { IPrismJSON } from './Prism';
// import Union from './Union';
// import CompoundObject, {ChildrenArray, ICompountObjectJSON} from './CompoundObject';
import PrimitiveObject from './PrimitiveObject';
// import Difference from './Difference';
// import Intersection from './Intersection';


export default class ObjectFactory{
  /**
   * Creates a new Primitive Object from its JSON 
   * @param json object toJSON 
   */
  public static newFromJSON(obj: IObjectsCommonJSON): ObjectsCommon {
    switch(obj.type){
      case Cube.typeName:
        return Cube.newFromJSON(obj as ICubeJSON);
      case Cylinder.typeName:
        return Cylinder.newFromJSON(obj as ICylinderJSON);
      case Sphere.typeName:
        return Sphere.newFromJSON(obj as ISphereJSON);
      case Prism.typeName:
        return Prism.newFromJSON(obj as IPrismJSON);
      // case Union.typeName:
      //   return Union.newFromJSON(json);
      // case Difference.typeName:
      //   return Difference.newFromJSON(json);
      // case Intersection.typeName:
      //   return Intersection.newFromJSON(json);
    }

    throw new Error('Unknown Primitive Object Type');

  }

  // public static createCompoundFromJSON(json: string, objectsCollector: Array <ObjectsCommon>): CompoundObject{
  //   const obj = JSON.parse(json);
  //   const children: ChildrenArray = [];
    
  //   (obj as ICompountObjectJSON).children.forEach(element => {
  //     const obj = objectsCollector.find( (obj) => (obj.getID() === element.getID()) );
  //     if(!obj) throw Error(`Child  ${element.getID()} not Found`);
  //     children.push(obj as Object3D);
  //   });
    
  //   switch(obj.type){
  //     case Union.typeName:
  //       return new Union(children,obj.operations);
  //     case Difference.typeName:
  //       return new Difference(children, obj.operations);
  //     case Intersection.typeName:
  //       return new Intersection(children, obj.operations); 
  //   }
  //   throw new Error('Unknown Compound Object Type');
  // }
}