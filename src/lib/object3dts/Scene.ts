import ObjectsCommon, { IObjectsCommonJSON } from './ObjectsCommon';
import * as THREE from 'three';
import ObjectFactory from './ObjectFactory';
import { isArray } from 'util';
import ObjectsGroup, { IObjectsGroupJSON } from './ObjectsGroup';
import RepetitionObject, { IRepetitionObjectJSON } from './RepetitionObject';
import { ICompoundObjectJSON } from './CompoundObject';
import BaseGrid from './BaseGrid';

import isEqual from 'lodash.isequal';

enum HelperType {
  Rotation = 'rotation',
  Translation = 'translation',
}
enum HelperAxis {
  X = 'x',
  Y = 'y',
  Z = 'z',
}
interface HelperDescription {
  type: HelperType;
  object: any;
  axis: HelperAxis;
  relative: boolean;
}

interface ISceneSetup {
  base: THREE.Group;
  ambientLight: THREE.AmbientLight;
  spotLight: THREE.SpotLight; 
}

export type ISceneJSON = Array<IObjectsCommonJSON>;

export default class Scene {
  
  // TODO. Need to create children before of creating objects!!
  public static newFromJSON(json: ISceneJSON): Scene {
    const scene = new Scene();
    try {
      scene.updateSceneFromJSON(json);
    } catch (e) {
      throw new Error(`Error creating Scene. ${e}`);
    }

    return scene;
  }


  private sceneSetup: ISceneSetup;
  private objectCollector: Array<ObjectsCommon>; /// all objects designed by user - including children
  private objectsInScene: Array<ObjectsCommon>; /// all parent objects designed by user -> to be 3D-drawn.
  private history:Array<ISceneJSON>; /// history of actions


  private lastJSON: object;
  private objectsGroup: THREE.Group;
  private historyIndex:number;

  constructor() {
    this.objectCollector = [];
    this.objectsInScene = [];
    this.setupScene();
    this.objectsGroup = new THREE.Group();
    this.lastJSON = this.toJSON();
    this.historyIndex = 0;
    this.history = [];
  }

  public canUndo():boolean{
    return (this.historyIndex > 0);
  }

  public canRedo():boolean{
    return (this.historyIndex > this.history.length - 1);
  }


  /**
   * Returns the Scene JSON descriptor: Array of Objects.
   * It only contains designed by user objects.
   * It does not contain helpers, plane, etc.
   */
  public toJSON(): ISceneJSON {
    const sceneJSON = this.objectsInScene.map(object => object.toJSON());
    return sceneJSON;
  }

  /**
   * Updates all the objects in a Scene, if object is not present. It adds it.
   * @param json json describin all the objects of the Scene
   */
  public updateSceneFromJSON(
    json: ISceneJSON,
  ): ISceneJSON {
    if (isEqual(json, this.toJSON())) return json;

    json.forEach(obj => {
      if (this.objectInScene(obj))
        this.getObject(obj).updateFromJSON(obj);
      else this.addNewObjectFromJSON(obj);
    });
    return this.toJSON();
  }


  public getSceneSetup(): THREE.Group{
    const group: THREE.Group = new THREE.Group();
    
    group.add(this.sceneSetup.ambientLight);
    group.add(this.sceneSetup.spotLight);
    group.add(this.sceneSetup.base);

    return group;
  }

  public getHelpers(): THREE.Group{
    const group: THREE.Group = new THREE.Group();
    
    //TODO

    return group;
  }

  /**
   * returns a THREE.Group object containing designed 3D objects .
   */
  public async getObjectsAsync(): Promise<THREE.Group> {

    if(isEqual(this.lastJSON, this.toJSON())) return this.objectsGroup;

    this.objectsGroup = new THREE.Group();

    const meshes: Array<THREE.Object3D> = await Promise.all(
      this.objectsInScene.map(object => object.getMeshAsync()),
    );

    meshes.forEach(mesh => {
      this.objectsGroup.add(mesh);
    });

    
    return this.objectsGroup;
  }

  /**
   * Adds floor and lights.
   */
  private setupScene(): void {
    
    //@David , esto debería ir en algún sitio de opciones de configuracion
    const gridConfig = {
      size: 200,
      smallGrid: {
        enabled: true,
        step: 2,
        color: 0xededed,
        lineWidth: 1,
      },
      bigGrid: {
        enabled: true,
        step: 10,
        color: 0xcdcdcd,
        lineWidth: 2,
      },
      centerGrid: {
        enabled: true,
        color: 0x9a9a9a,
        lineWidth: 2,
      },
      plane: {
        enabled: false,
        color: 0x98f5ff,
      },
    };
    
    
    this.sceneSetup = {
      base: new BaseGrid(gridConfig).getMesh(),
      ambientLight: new THREE.AmbientLight(0x555555), 
      spotLight: new THREE.SpotLight(0xeeeeee),
    };

    this.sceneSetup.spotLight.position.set(80, -100, 60)   
  }

  /**
   * Adds object to Scene and ObjectCollector. It creates a new object and assings a new id
   * @param json object descriptor (it ignores id)
   */
  public addNewObjectFromJSON(
    json: IObjectsCommonJSON,
  ): ISceneJSON {
    try {
      const object: ObjectsCommon = ObjectFactory.newFromJSON(json, this);
      return this.addExistingObject(object);
    } catch (e) {
      throw new Error(`Cannot add new Object from JSON ${e}`);
    }
  }

  public objectInObjectCollector(json: IObjectsCommonJSON): boolean {
    const obj = this.objectCollector.find(elem => elem.getID() === json.id);
    if (obj) return true;
    else return false;
  }

  public objectInScene(json: IObjectsCommonJSON): boolean {
    const obj = this.objectsInScene.find(elem => elem.getID() === json.id);
    if (obj) return true;
    else return false;
  }

  /**
   * Removes Object or Array of Objects from objectCollector array
   * @param json Object or Array of objects
   */
  public removeFromObjectCollector(
    json: ISceneJSON | IObjectsCommonJSON,
  ): ISceneJSON {
    if (isArray(json)) {
      json.forEach(obj => this.removeFromObjectCollector(obj));
    } else {
      if (!this.objectInObjectCollector(json))
        throw new Error(`Object id ${json.id} not present in Scene`);
      this.objectCollector = this.objectCollector.filter(
        obj => obj.getID() !== json.id,
      );
    }

    return this.toJSON();
  }

  /**
   * Removes Object or Array of Objects from BitbloqScene array
   * @param json Object or Array of objects
   */
  public removeFromScene(
    json: ISceneJSON | IObjectsCommonJSON,
  ): ISceneJSON {
    if (isArray(json)) {
      json.forEach(obj => this.removeFromScene(obj));
    } else {
      if (!this.objectInObjectCollector(json))
        throw new Error(`Object id ${json.id} not present in Scene`);
      this.objectsInScene = this.objectsInScene.filter(
        obj => obj.getID() !== json.id,
      );
    }

    return this.toJSON();
  }

  public cloneOject(json: IObjectsCommonJSON):ISceneJSON {
    if(this.objectInScene(json)){
      const newobj = this.getObject(json).clone();
      this.objectCollector.push(newobj);
      this.objectsInScene.push(newobj);
      return this.toJSON();
    }else{
      throw new Error('Cannot clone unknown object');
    }
  }

  public addExistingObject(object: ObjectsCommon): ISceneJSON {
    if (this.objectInObjectCollector(object.toJSON())) {
      throw Error('Object already in Scene');
    } else {
      //In case the objects has children, they must be removed from BitbloqScene (remain in ObjectCollector)
      if (object.getTypeName() === ObjectsGroup.typeName) {
        (object.toJSON() as IObjectsGroupJSON).group.forEach(obj => {
          if (!this.objectInScene(obj))
            throw new Error(
              'Cannot create a group of objects from objects not present in BitbloqScene',
            );
          this.removeFromScene(obj);
        });
      } else if (object.getTypeName() === RepetitionObject.typeName) {
        if (!this.objectInScene((object as any).object.toJSON()))
          throw new Error(
            'Cannot create a Repetition from an object not present in BitbloqScene',
          );
        this.removeFromScene(
          (object.toJSON() as IRepetitionObjectJSON).object,
        );
      }
      this.objectsInScene.push(object);
      this.objectCollector.push(object);
    }

    const sceneJSON = this.toJSON();
    //Add to history if someting has changed
    if(!isEqual(sceneJSON, this.lastJSON)){
      this.history = this.history.slice(0,this.historyIndex);
      this.history.push(sceneJSON);
      this.historyIndex = this.history.length - 1;
    }

    return sceneJSON;
  }

  /**
   * Removes Object from both Scene and ObjectCollector.
   * If object is not present is does NOT anything.
   * @param json json object descriptor (only id is important)
   */
  public removeObject(obj: IObjectsCommonJSON): ISceneJSON {
    try {
      this.removeFromScene(obj);
      this.removeFromObjectCollector(obj);
    } catch (e) {
      throw new Error(`Cannot Remove Object from Scene: ${e}`);
    }

    return this.toJSON();
  }

  /**
   * Returns a reference to the specified Object
   * @param obj Object descriptor to retreive
   */
  public getObject(obj: IObjectsCommonJSON): ObjectsCommon {
    const id = obj.id;
    const foundObj = this.objectCollector.find(object => object.getID() === id);
    if (!foundObj) throw new Error(`Scene.getObject(). Object ${id} not found`);

    return foundObj;
  }

  /**
   * Updates object if its present on the objects collector.
   * If not it triggers an error exception.
   * @param json json describing object
   */
  public updateObject(obj: IObjectsCommonJSON): ISceneJSON {
    const id = obj.id;
    let updated = false;

    this.objectCollector.forEach(object => {
      if (object.getID() === id) {
        object.updateFromJSON(obj);
        updated = true;
      }
    });

    if (!updated) throw new Error(`Object id ${id} not found`);
    return this.toJSON();
  }

  /**
   * It removes the ObjectsGroup from Scene and ObjectCollector.
   * It adds the members of the group to de Scene.
   * @param json group object descriptor (it only pays attention to id)
   */
  public unGroup(json: IObjectsGroupJSON): ISceneJSON {
    try{
      const group = this.getObject(json);
      if(!(group instanceof ObjectsGroup)) throw new Error(`Object is not a group`);
      const objects: Array<ObjectsCommon> = (group as ObjectsGroup).unGroup();
      // add the members of the group to the Scene
      objects.forEach(object => {
        this.objectsInScene.push(object);
      })

      //remove ObjectsGroups from Scene and ObjectCollector
      this.removeFromObjectCollector(json);
      this.removeFromScene(json);
    }catch(e){
      throw new Error(`Cannog ungroup. Unknown group ${e}`);
    }

    return this.toJSON();
  }

  /**
   * It removes the CompoundObject from Scene and ObjectCollector.
   * It adds the children to the Scene
   * @param json CompoundObject Descriptor. It only pays attention to id.
   */
  public undoCompound(json: ICompoundObjectJSON): ISceneJSON {
    return this.toJSON();
  }

  /**
   * It removes RepetitionObject from Scene and ObjectCollector.
   * It transform the RepetitionObject to a ObjectsGroup and add it to the Scene and ObjectCollector.
   * @param json RepetitionObject descriptor. It only pays attention to id
   */
  public repetitionToGroup(
    json: IRepetitionObjectJSON,
  ): ISceneJSON {

    try{
      const rep = this.getObject(json);
      if(!(rep instanceof RepetitionObject)) throw new Error(`Object is not a RepetitionObject`);
      const objects: Array<ObjectsCommon> = (rep as RepetitionObject).unGroup();

      //add objects to ObjectCollector
      objects.forEach(object => {
        this.objectCollector.push(object);
      })
      
      const group: ObjectsGroup = new ObjectsGroup(objects);

      // add new group to scene
      this.objectCollector.push(group);
      this.objectsInScene.push(group);


      //remove original object in repetion from ObjectCollector
      const original = rep.getOriginal();
      this.removeFromObjectCollector(original.toJSON());

      //remove ObjectsGroups from Scene and ObjectCollector
      this.removeFromObjectCollector(json);
      this.removeFromScene(json);

    }catch(e){
      throw new Error(`Cannog ungroup. Unknown group ${e}`);
    }

    return this.toJSON();
  }


  // Establece el helper que debe mostrarse en la vista 3d
  // Si no se le pasa ningún parámetro entonces no mostrar ninguno
  public setActiveHelper(helperDescription?: HelperDescription) {}

  // Deshace la última operación y devuelve la escena después de deshacer
  public undo(): any {}

  // Rehace la última operación y devuelve la escena después de rehacer
  public redo(): any {}
}
