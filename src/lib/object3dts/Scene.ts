import ObjectsCommon, { IObjectsCommonJSON } from './ObjectsCommon';
import * as THREE from 'three';
import ObjectFactory from './ObjectFactory';

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

export default class Scene {
  private objectCollector: Array<ObjectsCommon>; /// all objects designed by user - including children
  private BitbloqScene: Array<ObjectsCommon>; /// all parent objects designed by user -> to be 3D-drawn.

  constructor() {
    this.objectCollector = [];
    this.BitbloqScene = [];
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
   * returns a THREE.Scene object containing everyghint to be drawn.
   * TODO
   */
  public async getSceneAsync(): Promise<THREE.Scene> {
    const scene: THREE.Scene = new THREE.Scene();

    //Add objects to Scene
    const meshes: Array<THREE.Object3D> = await Promise.all(
      this.BitbloqScene.map(object => object.getMeshAsync()),
    );
    meshes.forEach(mesh => {
      scene.add(mesh);
    });
    return scene;
  }

  public setupScene(): void {}

  /**
   * Adds object to Scene and ObjectCollector. It creates a new object and assings a new id
   * @param json object descriptor (it ignores id)
   */
  public addNewObjectFromJSON(json: IObjectsCommonJSON): IObjectsCommonJSON {
    const object: ObjectsCommon = ObjectFactory.newFromJSON(json, this);
    this.BitbloqScene.push(object);
    this.objectCollector.push(object);
    return object.toJSON();
  }

  /**
   * Removes Object from both Scene and ObjectCollector.
   * If object is not present is does NOT anything.
   * @param json json object descriptor (only id is important)
   */
  public removeObject(obj: IObjectsCommonJSON): void {
    const id = obj.id;

    this.objectCollector = this.objectCollector.filter(
      object => object.getID() !== id,
    );
    this.BitbloqScene = this.BitbloqScene.filter(
      object => object.getID() !== id,
    );
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
  public updateObject(obj: IObjectsCommonJSON): void {
    const id = obj.id;
    let updated = false;

    this.objectCollector.forEach(object => {
      if (object.getID() === id) {
        object.updateFromJSON(obj);
        updated = true;
      }
    });

    if (!updated) throw new Error(`Object id ${id} not found`);
  }

  /**
   * It removes the ObjectsGroup from Scene and ObjectCollector.
   * It adds the members of the group to de Scene.
   * @param json group object descriptor (it only pays attention to id)
   */
  public unGroup(json: string): void {}

  /**
   * It removes the CompoundObject from Scene and ObjectCollector.
   * It adds the children to the Scene
   * @param json CompoundObject Descriptor. It only pays attention to id.
   */
  public undoCompound(json: string): void {}

  /**
   * It removes RepetitionObject from Scene and ObjectCollector.
   * It transform the RepetitionObject to a ObjectsGroup and add it to the Scene and ObjectCollector.
   * @param json RepetitionObject descriptor. It only pays attention to id
   */
  public repetitionToGroup(json: string): void {}

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
