import ObjectsCommon, { IObjectsCommonJSON } from './ObjectsCommon';
import * as THREE from 'three';
import ObjectFactory from './ObjectFactory';
import { isArray } from 'util';
import ObjectsGroup, { IObjectsGroupJSON } from './ObjectsGroup';
import RepetitionObject, { IRepetitionObjectJSON } from './RepetitionObject';
import { ICompoundObjectJSON } from './CompoundObject';
import BaseGrid from './BaseGrid';

import isEqual from 'lodash.isequal';

type ClickHandler = (object?: any) => void;

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

export default class Scene {
  //TODO. Need to create children before of creating objects!!
  public static newFromJSON(json: Array<IObjectsCommonJSON>): Scene {
    const scene = new Scene();
    try {
      scene.updateFromJSON(json);
    } catch (e) {
      throw new Error(`Error creating Scene. ${e}`);
    }

    return scene;
  }

  private sceneSetup: ISceneSetup;
  private objectCollector: Array<ObjectsCommon>; /// all objects designed by user - including children
  private BitbloqScene: Array<ObjectsCommon>; /// all parent objects designed by user -> to be 3D-drawn.

  constructor() {
    this.objectCollector = [];
    this.BitbloqScene = [];
    //this.sceneSetup = {};
    this.setupScene();

   
  }

  /**
   * Returns the Scene JSON descriptor: Array of Objects.
   * It only contains designed by user objects.
   * It does not contain helpers, plane, etc.
   */
  public toJSON(): Array<IObjectsCommonJSON> {
    return this.BitbloqScene.map(object => object.toJSON());
  }

  /**
   * Updates all the objects in a Scene, if object is not present. It adds it.
   * @param json json describin all the objects of the Scene
   */
  public updateFromJSON(
    json: Array<IObjectsCommonJSON>,
  ): Array<IObjectsCommonJSON> {
    if (isEqual(json, this.toJSON())) return json;

    json.forEach(obj => {
      if (this.objectInBitbloqScene(obj))
        this.getObject(obj).updateFromJSON(obj);
      else this.addNewObjectFromJSON(obj);
    });

    if (!isEqual(json, this.toJSON()))
      throw new Error('Unexpected Error updating Scene');

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
    const group: THREE.Group = new THREE.Group();

    const meshes: Array<THREE.Object3D> = await Promise.all(
      this.BitbloqScene.map(object => object.getMeshAsync()),
    );

    meshes.forEach(mesh => {
      group.add(mesh);
    });

    return group;
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
  ): Array<IObjectsCommonJSON> {
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

  public objectInBitbloqScene(json: IObjectsCommonJSON): boolean {
    const obj = this.BitbloqScene.find(elem => elem.getID() === json.id);
    if (obj) return true;
    else return false;
  }

  /**
   * Removes Object or Array of Objects from objectCollector array
   * @param json Object or Array of objects
   */
  public removeFromObjectCollector(
    json: Array<IObjectsCommonJSON> | IObjectsCommonJSON,
  ): Array<IObjectsCommonJSON> {
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
  public removeFromBitbloqScene(
    json: Array<IObjectsCommonJSON> | IObjectsCommonJSON,
  ): Array<IObjectsCommonJSON> {
    if (isArray(json)) {
      json.forEach(obj => this.removeFromBitbloqScene(obj));
    } else {
      if (!this.objectInObjectCollector(json))
        throw new Error(`Object id ${json.id} not present in Scene`);
      this.BitbloqScene = this.BitbloqScene.filter(
        obj => obj.getID() !== json.id,
      );
    }

    return this.toJSON();
  }

  public addExistingObject(object: ObjectsCommon): Array<IObjectsCommonJSON> {
    if (this.objectInObjectCollector(object.toJSON())) {
      throw Error('Object already in Scene');
    } else {
      //In case the objects has children, they must be removed from BitbloqScene (remain in ObjectCollector)
      if (object.getTypeName() === ObjectsGroup.typeName) {
        (object.toJSON() as IObjectsGroupJSON).group.forEach(obj => {
          if (!this.objectInBitbloqScene(obj))
            throw new Error(
              'Cannot create a group of objects from objects not present in BitbloqScene',
            );
          this.removeFromBitbloqScene(obj);
        });
      } else if (object.getTypeName() === RepetitionObject.typeName) {
        if (!this.objectInBitbloqScene((object as any).object.toJSON()))
          throw new Error(
            'Cannot create a Repetition from an object not present in BitbloqScene',
          );
        this.removeFromBitbloqScene(
          (object.toJSON() as IRepetitionObjectJSON).object,
        );
      }
      this.BitbloqScene.push(object);
      this.objectCollector.push(object);
    }

    return this.toJSON();
  }

  /**
   * Removes Object from both Scene and ObjectCollector.
   * If object is not present is does NOT anything.
   * @param json json object descriptor (only id is important)
   */
  public removeObject(obj: IObjectsCommonJSON): Array<IObjectsCommonJSON> {
    try {
      this.removeFromBitbloqScene(obj);
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
  public updateObject(obj: IObjectsCommonJSON): Array<IObjectsCommonJSON> {
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
  public unGroup(json: IObjectsGroupJSON): Array<IObjectsCommonJSON> {
    return this.toJSON();
  }

  /**
   * It removes the CompoundObject from Scene and ObjectCollector.
   * It adds the children to the Scene
   * @param json CompoundObject Descriptor. It only pays attention to id.
   */
  public undoCompound(json: ICompoundObjectJSON): Array<IObjectsCommonJSON> {
    return this.toJSON();
  }

  /**
   * It removes RepetitionObject from Scene and ObjectCollector.
   * It transform the RepetitionObject to a ObjectsGroup and add it to the Scene and ObjectCollector.
   * @param json RepetitionObject descriptor. It only pays attention to id
   */
  public repetitionToGroup(
    json: IRepetitionObjectJSON,
  ): Array<IObjectsCommonJSON> {
    return this.toJSON();
  }

  // TODO Methods for frontend

  /**
   * Returns the DOM Element where the scene is rendered
   */
  public getDOMELement(): HTMLElement {
    // TODO En principio renderer.domElement. Pero como tenemos actualmente
    // 2 renderers, uno para la scene y otro para el cubo de navegación en
    // la esquina de arriba a la izquierda, creo que habría que crear un <div>
    // padre que es el que devolvemos aquí, e insertar los dos renderer en ese
    // <div>. Si quieres de momento devuelve el renderer.domElement y ya vemos
    // luego lo del cubo de navegación
    return document.body;
  }

  // Le pasa un handler que debe ser llamado cada vez que se hace click
  // el primer parámetro del handler debe ser el objeto sobre el que se ha
  // hecho click, o null si no se ha hecho click sobre ninguno
  public onClick(handler: ClickHandler): void {}

  // Establece el helper que debe mostrarse en la vista 3d
  // Si no se le pasa ningún parámetro entonces no mostrar ninguno
  public setActiveHelper(helperDescription?: HelperDescription) {}

  // Si se le pasa true entonces la cámara es ortográfica y se le pasa
  // false la cámara es perspectiva
  public setOrtographicCamera(isOrtographic: boolean): void {}

  public zoomIn(): void {}

  public zoomOut(): void {}

  // Por si por ejemplo quieres cargar una escena que ya tengas creada
  // El nombre setScene parece un poco raro dentro de la clase Scene
  // Scene.setSceene(scene)
  // setBitbloqScene? setSceneObjects?
  public setScene(scene: any): void {}

  // Estos 2 los podemos hacer aquí dentro (da más valor a la librería)
  // pero si es muy complicado lo podemos hacer fuera y podemos dejar la escena
  // en el estado deseado con setScene

  // Deshace la última operación y devuelve la escena después de deshacer
  public undo(): any {}

  // Rehace la última operación y devuelve la escena después de rehacer
  public redo(): any {}
}
