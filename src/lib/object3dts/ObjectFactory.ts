import ObjectsCommon from "./ObjectsCommon";
import Cube from "./Cube";
import Cylinder from "./Cylinder";
import Sphere from "./Sphere";
import Prism from "./Prism";


export default class ObjectFactory{
  /**
   * Creates a new Object from its JSON 
   * @param json object toJSON 
   */
  public static newFromJSON(json: string): ObjectsCommon {
    const obj = JSON.parse(json);
    switch(obj.type){
      case Cube.typeName:
        return Cube.newFromJSON(json) as Cube;
      case Cylinder.typeName:
        return Cylinder.newFromJSON(json) as Cylinder;
      case Sphere.typeName:
        return Sphere.newFromJSON(json) as Sphere;
      case Prism.typeName:
        return Prism.newFromJSON(json) as Prism;
    }

    throw new Error('Unknown Object Type');

  }
}