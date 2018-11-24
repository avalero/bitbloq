import * as THREE from 'three';
import ObjectsCommon, { IObjectsCommonJSON } from './ObjectsCommon';
import { OperationsArray } from './ObjectsCommon';
import Object3D from './Object3D';
import Scene from './Scene';

export interface IObjectsGroupJSON extends IObjectsCommonJSON {
  group: Array<IObjectsCommonJSON>;
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
    const group: Array<ObjectsCommon> = object.group.map(obj =>
      scene.getObject(obj),
    );
    return new ObjectsGroup(group);
  }

  private group: Array<ObjectsCommon>;

  constructor(objects: Array<ObjectsCommon> = []) {
    super(ObjectsCommon.createViewOptions(), []);
    this.group = objects;
  }
  // Group operations. Will be transferred to children only when un-grouped.
  public setOperations(operations: OperationsArray = []): void {
    this.operations = [];
    this.operations = operations.slice();
  }

  public add(object: Object3D): void {
    this.group.push(object);
  }

  protected clean(): void {
    this.group.length = 0;
  }

  // When a group is un-grouped all the operations of the group are transferred to the single objects
  // Return the array of objects with all the inherited operations of the group.
  public unGroup(): Array<ObjectsCommon> {
    this.group.forEach(object3D => {
      object3D.addOperations(this.operations);
    });
    return this.group;
  }

  public getMeshAsync(): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
      let meshGroup: THREE.Group = new THREE.Group();

      // Operations must be applied to the single objects, but they are not transferred whilst they are grouped.
      if (this.group.length === 0) {
        reject('No item in group');
        return;
      }

      const promises: Promise<THREE.Object3D>[] = [];

      this.group.forEach(object3D => {
        // only first level objets require to update operations, no need to make deep copy
        const objectClone = object3D.clone();
        objectClone.addOperations(this.operations);
        promises.push(objectClone.getMeshAsync());
      });

      Promise.all(promises).then(meshes => {
        meshes.forEach((mesh, i) => {
          meshGroup = meshGroup.add(mesh);
        });

        resolve(meshGroup);
      });
    });
  }

  public clone(): ObjectsGroup {
    const groupClone = this.group.map(obj => obj.clone());
    return new ObjectsGroup(groupClone);
  }

  public toJSON(): IObjectsGroupJSON {
    const obj: IObjectsGroupJSON = {
      id: this.id,
      type: this.type,
      viewOptions: this.viewOptions,
      operations: this.operations,
      group: [],
    };

    obj.group = this.group.map(obj => obj.toJSON());

    return obj;
  }

  /**
   * Returns Object Reference if found in group. If not, throws Error.
   * @param obj Object descriptor
   */
  private getObject(obj: IObjectsCommonJSON): ObjectsCommon {
    const result = this.group.find(object => object.getID() === obj.id);
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
      object.group.forEach(obj => {
        const objToUpdate = this.getObject(obj);
        objToUpdate.updateFromJSON(obj);
      });
    } catch (e) {
      throw new Error(`Cannot update Group: ${e}`);
    }
  }
}
