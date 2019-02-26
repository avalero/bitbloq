import * as THREE from 'three';
import STLObject from './STLObject';
import { ISTLParams, OperationsArray, IViewOptions, ISTLJSON } from './Interfaces';
import ObjectsCommon from './ObjectsCommon';

export default class PredesignedObject extends STLObject {
  public static typeName: string = 'PredesignedObject';


  public static newFromJSON(object: ISTLJSON): PredesignedObject {
    if (object.type !== PredesignedObject.typeName) {
      throw new Error('Not Predesigned Object');
    }

    let stl: PredesignedObject;
    let mesh: THREE.Mesh;
    if (object.mesh) {
      mesh = new THREE.ObjectLoader().parse(object.mesh);
      stl = new PredesignedObject(
        object.parameters,
        object.operations,
        object.viewOptions,
        mesh,
      );
    } else {
      stl = new PredesignedObject(
        object.parameters,
        object.operations,
        object.viewOptions,
      );
    }

    stl.id = object.id || stl.id;

    return stl;
  }

  constructor(
    parameters: Partial<ISTLParams>,
    operations: OperationsArray = [],
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    mesh?: THREE.Mesh | undefined,
  ) {
    super(parameters, operations, viewOptions, mesh);
    this.type = PredesignedObject.typeName;
  }
}
