import ObjectsCommon, {OperationsArray} from './ObjectsCommon';
import {IObjectPosition} from './Scene';
import Cube from './Cube';

export default class PositionCalculator{
  private operations: OperationsArray;
  private object: ObjectsCommon;
  private position: IObjectPosition;

  constructor(object: ObjectsCommon){
    this.object = object;
    this.operations = [];
  }

  private async applyOperationsAsync():Promise<void>{
    debugger;
    let obj:ObjectsCommon | undefined = this.object;
    while(obj){
      this.prePushOperations(obj.getOperations());
      obj = obj.getParent();
    }

    const dummyObj = new Cube({width:1, height:1, depth:1});
    dummyObj.addOperations(this.operations);
    await dummyObj.computeMeshAsync();
    const mesh = await dummyObj.getMeshAsync();
    this.position = {
      position: {
        x: mesh.position.x,
        y: mesh.position.y,
        z: mesh.position.z,
      },
      angle: {
        x: (mesh.rotation.x * 180) / Math.PI,
        y: (mesh.rotation.y * 180) / Math.PI,
        z: (mesh.rotation.z * 180) / Math.PI,
      },
      scale: {
        x: mesh.scale.x,
        y: mesh.scale.y,
        z: mesh.scale.z,
      },
    };
  }

  private prePushOperations(operations: OperationsArray): void {
    this.operations = [
      ... operations,
      ... this.operations,
    ]
  }

  public async getPositionAsync(): Promise<IObjectPosition> {
    await this.applyOperationsAsync();
    return this.position;
  }
}
