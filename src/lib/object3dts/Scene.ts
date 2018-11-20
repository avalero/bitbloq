import ObjectsCommon from "./ObjectsCommon";
import * as THREE from 'three';
import ObjectFactory from "./ObjectFactory";

export default class Scene{
  private objectCollector: Array<ObjectsCommon>;
  private BitbloqScene:Array<ObjectsCommon>;

  constructor(){
    this.objectCollector = [];
    this.BitbloqScene = [];
  }

  public toJSON():string{
    const objs: Array<string> = this.BitbloqScene.map(object => object.toJSON());
    return JSON.stringify(objs);
  }

  // create scene and add objects
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

  public addObjectFromJSON(json: string):void{
    const object:ObjectsCommon = ObjectFactory.newFromJSON(json);
    this.BitbloqScene.push(object);
    this.objectCollector.push(object);
  }

  public removeObject(json:string):void{
    const obj = JSON.parse(json);
    const id = obj.id;

    this.objectCollector = this.objectCollector.filter(object => object.getID() !== id);
    this.BitbloqScene = this.BitbloqScene.filter(object => object.getID() !== id);
  }

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

  public unGroup(json: string):void{

  }

  public unDoCompound(json: string):void{

  }

  public repetitionToGroup(json: string):void{

  }
}