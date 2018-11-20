import ObjectsCommon from "./ObjectsCommon";
import * as THREE from 'three';
import ObjectFactory from "./ObjectFactory";

export default class Scene{
  private objectCollector: Array<ObjectsCommon>; /// all objects designed by user - including children
  private BitbloqScene:Array<ObjectsCommon>; /// all parent objects designed by user -> to be 3D-drawn.

  constructor(){
    this.objectCollector = [];
    this.BitbloqScene = [];
  }

  /**
   * Returns the Scene JSON descriptor: Array of Objects.
   * It only contains designed by user objects.
   * It does not contain helpers, plane, etc. 
   */
  public toJSON():string{
    const objs: Array<string> = this.BitbloqScene.map(object => object.toJSON());
    return JSON.stringify(objs);
  }

  /**
   * returns a THREE.Scene object containing everyghint to be drawn.
   * TODO
   */
  public async getSceneAsync():Promise<THREE.Scene> {
    const scene:THREE.Scene = new THREE.Scene();
    
    //Add objects to Scene
    const meshes:Array<THREE.Object3D> = await Promise.all(this.BitbloqScene.map(object => object.getMeshAsync()));
    meshes.forEach(mesh => {
      scene.add(mesh);  
    })
    return scene;
  }

  public setupScene():void{

  }

  /**
   * Adds object to Scene and ObjectCollector. It creates a new object and assings a new id
   * @param json object descriptor (it ignores id)
   */
  public addObjectFromJSON(json: string):void{
    const object:ObjectsCommon = ObjectFactory.newFromJSON(json);
    this.BitbloqScene.push(object);
    this.objectCollector.push(object);
  }

  /**
   * Removes Object from both Scene and ObjectCollector.
   * If object is not present is does NOT anything.
   * @param json json object descriptor (only id is important)
   */
  public removeObject(json:string):void{
    const obj = JSON.parse(json);
    const id = obj.id;

    this.objectCollector = this.objectCollector.filter(object => object.getID() !== id);
    this.BitbloqScene = this.BitbloqScene.filter(object => object.getID() !== id);
  }

  /**
   * Updates object if its present on the objects collector. 
   * If not it triggers an error exception.
   * @param json json describing object
   */
  public updateObject(json: string):void{
    const obj = JSON.parse(json);
    const id = obj.id;
    let updated = false;

    this.objectCollector.forEach(object => {
      if(object.getID() === id){
        object.updateFromJSON(json);
        updated = true;
      }
    });

    if(!updated) throw new Error(`Object id ${id} not found`);
  }

  /**
   * It removes the ObjectsGroup from Scene and ObjectCollector.
   * It adds the members of the group to de Scene.
   * @param json group object descriptor (it only pays attention to id)
   */
  public unGroup(json: string):void{

  }


  /**
   * It removes the CompoundObject from Scene and ObjectCollector.
   * It adds the children to the Scene
   * @param json CompoundObject Descriptor. It only pays attention to id.
   */
  public undoCompound(json: string):void{

  }

  /**
   * It removes RepetitionObject from Scene and ObjectCollector.
   * It transform the RepetitionObject to a ObjectsGroup and add it to the Scene and ObjectCollector.
   * @param json RepetitionObject descriptor. It only pays attention to id
   */
  public repetitionToGroup(json: string):void{

  }
}