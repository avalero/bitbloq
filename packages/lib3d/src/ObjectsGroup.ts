import * as THREE from "three";
import Object3D from "./Object3D";
import ObjectsCommon from "./ObjectsCommon";
import Scene from "./Scene";

import Union from "./Union";
import RepetitionObject from "./RepetitionObject";

import {
  IObjectsGroupJSON,
  IObjectsCommonJSON,
  IViewOptions,
  OperationsArray
} from "./Interfaces";

export default class ObjectsGroup extends ObjectsCommon {
  public static typeName: string = "ObjectsGroup";

  /**
   *
   * @param object the object descriptor of the group
   * @param scene the scene to which the object belongs
   */
  public static newFromJSON(object: IObjectsGroupJSON, scene: Scene) {
    if (object.type !== ObjectsGroup.typeName) {
      throw new Error(
        `Types do not match ${ObjectsGroup.typeName}, ${object.type}`
      );
    }
    try {
      const group: ObjectsCommon[] = object.children.map(obj =>
        scene.getObject(obj)
      );

      const groupObj = new ObjectsGroup(
        group,
        object.viewOptions,
        object.operations
      );

      groupObj.id = object.id || groupObj.id;
      return groupObj;
    } catch (e) {
      throw new Error(`Cannot create ObjectsGroup. ${e}`);
    }
  }

  private children: ObjectsCommon[];

  constructor(
    children: ObjectsCommon[] = [],
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    operations: OperationsArray = [],
    mesh?: THREE.Group | undefined
  ) {
    super(viewOptions, [...operations]);
    this.children = children;
    this.children.forEach(child => child.setParent(this));
    this.type = ObjectsGroup.typeName;
    this.mesh = new THREE.Group();
    this.meshPromise = null;

    if (mesh) {
      this.setMesh(mesh);
    } else {
      this.meshPromise = this.computeMeshAsync();
    }
  }

  get meshUpdateRequired(): boolean {
    this.children.forEach(child => {
      this._meshUpdateRequired =
        this._meshUpdateRequired ||
        child.meshUpdateRequired ||
        child.pendingOperation;
    });

    return this._meshUpdateRequired;
  }

  set meshUpdateRequired(a: boolean) {
    this._meshUpdateRequired = a;
  }

  get pendingOperation(): boolean {
    this.children.forEach(child => {
      this._pendingOperation = this._pendingOperation || child.pendingOperation;
    });

    return this._pendingOperation;
  }

  set pendingOperation(a: boolean) {
    this._pendingOperation = a;
  }

  public getChildren(): ObjectsCommon[] {
    return this.children;
  }

  public add(object: Object3D): void {
    this.children.push(object);
  }

  public toUnion(): Union {
    const unionChildren: Object3D[] = [];
    this.children.forEach(child => {
      if (child instanceof Object3D) {
        unionChildren.push(child);
      } else if (child instanceof RepetitionObject) {
        unionChildren.push(child.toUnion());
      } else if (child instanceof ObjectsGroup) {
        unionChildren.push(child.toUnion());
      }
    });
    return new Union(unionChildren);
  }
  public async computeMeshAsync(): Promise<THREE.Group> {
    // Operations must be applied to the single objects, but they are not transferred whilst they are grouped.
    if (this.children.length === 0) {
      throw new Error("No item in group");
    }
    this.meshPromise = new Promise(async (resolve, reject) => {
      try {
        this.mesh = new THREE.Group();

        const promises: Array<Promise<THREE.Object3D>> = this.children.map(
          object3D => {
            const objectClone = object3D.clone();
            const json = objectClone.toJSON();
            json.operations = json.operations.concat(this.operations);
            objectClone.updateFromJSON(json, true);
            return objectClone.getMeshAsync();
          }
        );

        const meshes = await Promise.all(promises);

        meshes.forEach(mesh => {
          this.mesh.add(mesh);
        });

        resolve(this.mesh);
      } catch (e) {
        reject(e);
      }
    });
    return this.meshPromise as Promise<THREE.Group>;
  }

  // When a group is un-grouped all the operations of the group are transferred to the single objects
  // Return the array of objects with all the inherited operations of the group.
  public unGroup(): ObjectsCommon[] {
    this.children.forEach(object3D => {
      const json = object3D.toJSON();
      json.operations = json.operations.concat(this.operations);
      object3D.updateFromJSON(json, true);
    });
    return this.children;
  }

  public clone(): ObjectsGroup {
    const groupClone = this.children.map(obj2clone => obj2clone.clone());
    const obj = new ObjectsGroup(groupClone, this.viewOptions, this.operations);
    return obj;
  }

  public toJSON(): IObjectsGroupJSON {
    const obj: IObjectsGroupJSON = {
      ...super.toJSON(),
      children: this.children.map(obj2JSON => obj2JSON.toJSON())
    };

    return obj;
  }

  /**
   * Updates objects belonging to a group. Group members cannot be changed.
   * If group members do not match an Error is thrown
   * @param object ObjectGroup descriptor object
   */
  public updateFromJSON(
    object: IObjectsGroupJSON,
    fromParent: boolean = false
  ) {
    if (object.id !== this.id) {
      throw new Error(`ids do not match ${object.id}, ${this.id}`);
    }

    const newChildren: ObjectsCommon[] = [];
    try {
      object.children.forEach(objChild => {
        const objToUpdate = this.getChild(objChild);
        newChildren.push(objToUpdate);
        objToUpdate.updateFromJSON(objChild, true);
      });

      if (this.meshUpdateRequired || this.pendingOperation) {
        this._meshUpdateRequired = true;
        this.children = [...newChildren];
      }

      const vO = {
        ...ObjectsCommon.createViewOptions(),
        ...object.viewOptions
      };
      this.setOperations(object.operations);
      this.setViewOptions(vO);
      // if has no parent, update mesh, else update through parent
      const objParent: ObjectsCommon | undefined = this.getParent();
      if (objParent && !fromParent) {
        objParent.updateFromJSON(objParent.toJSON());
      } else {
        if (
          this.meshUpdateRequired ||
          this.pendingOperation ||
          this.viewOptionsUpdateRequired
        ) {
          this.meshPromise = this.computeMeshAsync();
        }
      }
    } catch (e) {
      throw new Error(`Cannot update Group: ${e}`);
    }
  }

  protected clean(): void {
    this.children.length = 0;
  }

  private setMesh(mesh: THREE.Group): void {
    this.mesh = mesh;

    this.meshUpdateRequired = false;
    this.pendingOperation = false;
    this.viewOptionsUpdateRequired = false;

    this.mesh.updateMatrixWorld(true);
    this.mesh.updateMatrix();
  }

  /**
   * Returns Object Reference if found in group. If not, throws Error.
   * @param obj Object descriptor
   */
  private getChild(obj: IObjectsCommonJSON): ObjectsCommon {
    const result = this.children.find(object => object.getID() === obj.id);
    if (result) {
      return result;
    }
    throw new Error(`Object id ${obj.id} not found in group`);
  }
}
