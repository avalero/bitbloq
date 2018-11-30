import * as THREE from 'three';
import ObjectsCommon, { IObjectsCommonJSON } from './ObjectsCommon';
import { OperationsArray } from './ObjectsCommon';
import Object3D from './Object3D';
import Scene from './Scene';

export interface IObjectsGroupJSON extends IObjectsCommonJSON {
  children: Array<IObjectsCommonJSON>;
}

export default class ObjectsGroup extends ObjectsCommon {
  static typeName: string = 'ObjectsGroup';

  /**
   *
   * @param object the object descriptor of the group
   * @param scene the scene to which the object belongs
   */
  public static newFromJSON(object: IObjectsGroupJSON, scene: Scene) {
    if (object.type !== ObjectsGroup.typeName)
      throw new Error(
        `Types do not match ${ObjectsGroup.typeName}, ${object.type}`,
      );
    try {
      const group: Array<ObjectsCommon> = object.children.map(obj =>
        scene.getObject(obj),
      );
      return new ObjectsGroup(group);
    } catch (e) {
      throw new Error(`Cannot create ObjectsGroup. ${e}`);
    }
  }

  private children: Array<ObjectsCommon>;

  constructor(children: Array<ObjectsCommon> = []) {
    super(ObjectsCommon.createViewOptions(), []);
    this.children = children;
    this.type = ObjectsGroup.typeName;
  }
  // Group operations. Will be transferred to children only when un-grouped.
  // public setOperations(operations: OperationsArray = []): void {
  //   this.operations = [];
  //   this.operations = operations.slice();
  //   this._pendingOperation = true;
  // }

  public add(object: Object3D): void {
    this.children.push(object);
  }

  protected clean(): void {
    this.children.length = 0;
  }

  // When a group is un-grouped all the operations of the group are transferred to the single objects
  // Return the array of objects with all the inherited operations of the group.
  public unGroup(): Array<ObjectsCommon> {
    this.children.forEach(object3D => {
      object3D.addOperations(this.operations);
    });
    return this.children;
  }

  public async getMeshAsync(): Promise<THREE.Group> {

    // Operations must be applied to the single objects, but they are not transferred whilst they are grouped.
    if (this.children.length === 0) {
      throw new Error('No item in group');
    }

    let meshGroup: THREE.Group = new THREE.Group();

    const promises: Array <Promise<THREE.Object3D>> = this.children.map( object3D => {
      const objectClone = object3D.clone();
      objectClone.addOperations(this.operations);
      return objectClone.getMeshAsync();
    })

    const meshes = await Promise.all(promises);

    meshes.forEach((mesh) => {
      meshGroup.add(mesh);
    });
    return meshGroup;
  }

  public clone(): ObjectsGroup {
    const groupClone = this.children.map(obj => obj.clone());
    const obj = new ObjectsGroup(groupClone);
    obj.setOperations(this.operations); 
    return obj;
  }

  public toJSON(): IObjectsGroupJSON {
    const obj: IObjectsGroupJSON = {
      ...super.toJSON(),
      children: this.children.map(obj => obj.toJSON()),
    };

    return obj;
  }

  /**
   * Returns Object Reference if found in group. If not, throws Error.
   * @param obj Object descriptor
   */
  private getChild(obj: IObjectsCommonJSON): ObjectsCommon {
    const result = this.children.find(object => object.getID() === obj.id);
    if (result) return result;
    else throw new Error(`Object id ${obj.id} not found in group`);
  }

  /**
   * Updates objects belonging to a group. Group members cannot be changed.
   * If group members do not match an Error is thrown
   * @param object ObjectGroup descriptor object
   */
  public updateFromJSON(object: IObjectsGroupJSON) {
    if (object.id !== this.id)
      throw new Error(`ids do not match ${object.id}, ${this.id}`);

    try {
      object.children.forEach(obj => {
        const objToUpdate = this.getChild(obj);
        objToUpdate.updateFromJSON(obj);
      });
      const vO = {
        ...ObjectsCommon.createViewOptions(),
        ...object.viewOptions,
      };
      this.setOperations(object.operations);
      this.setViewOptions(vO);
    } catch (e) {
      throw new Error(`Cannot update Group: ${e}`);
    }
  }
}
