import STLObject from './STLObject';
import { ISTLParams, OperationsArray, IViewOptions } from './Interfaces';
import ObjectsCommon from './ObjectsCommon';

export default class PredesignedObject extends STLObject {
  public static typeName: string = 'PredesignedObject';

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
