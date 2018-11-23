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

  //FIXME
  public updateFromJSON(object: IObjectsGroupJSON) {
    throw new Error('When updating ObjectsGroup create a new group');
    // if (this.id === object.id) {
    //   this.setOperations(object.operations);
    //   this.setViewOptions(object.viewOptions);
    //   this.group = [];
    //   this.group = object.group.map(obj => this.scene.getObject(obj));
    // } else {
    //   throw new Error('Object id does not match with JSON id');
    // }
  }
}
