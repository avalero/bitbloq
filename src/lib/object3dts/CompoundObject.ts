import {OperationsArray, Object3D, ChildrenArray} from './Object3D';
import isEqual from'lodash.isequal';
import * as THREE from 'three';

import Worker from './compound.worker';

export default class CompoundObject extends Object3D {

  protected worker:Worker;

  constructor(children: ChildrenArray = [], operations: OperationsArray = []){
    super(operations);
    this.children = children;
    this._updateRequired = true;
    this.setOperations();
    
    const t0 = performance.now();
    if (typeof(Worker) !== "undefined"){
      this.worker = new Worker();
    }
    const t1 = performance.now();
    console.log(`WebWorker creation time ${t1 - t0} millis`);

  }


  public getTypeName():string{
    throw new Error("Implemented in child");
    return "";
  }

  public getMeshAsync(): Promise<THREE.Mesh> {
    const self:CompoundObject = this;
    return new Promise(function (resolve, reject){
      if(self.updateRequired){
        console.log('Update Compound Object Mesh');
        if (typeof(Worker) !== "undefined"){
          //WEB WORKER
          self.worker.onmessage = (event:any) => {
            const t0 = performance.now();
            if(event.data.status !== 'ok'){
              reject("Compound Object Error");
              return;
            }

            const message = event.data;
            //recompute object form vertices and normals

            self.fromVerticesAndNormals(message.vertices, message.normals);

            const t1 = performance.now();
            console.log(`WebWorker deserialize Execuetion time ${t1 - t0} millis`);
            if(self.mesh instanceof THREE.Mesh){
              resolve(self.mesh);
            }else{
              const reason = new Error('Mesh not computed correctly');
              reject(reason);
            }
          };
          //Lets create an array of vertices and normals for each child
          const t0 = performance.now();
          const bufferArray: Array<ArrayBuffer> = self.toBufferArray();

          const message = {
            type: self.getTypeName(),
            numChildren: self.children.length,
            bufferArray,
          }
          self.worker.postMessage(message, bufferArray);
          const t1 = performance.now();
          console.log(`WebWorker serialize Execuetion time ${t1 - t0} millis`);
        } else {
          //No WebWorker support. Make it sync.
          self.mesh = self.getMesh();
          if(self.mesh instanceof THREE.Mesh){
            resolve(self.mesh);
          }else{
            const reason = new Error('Mesh not computed correctly');
            reject(reason);
          }
        }
      }else{
        if (self.pendingOperation){
          self.applyOperations();
        }
        resolve(self.mesh)
      }
    });
  }

  protected fromVerticesAndNormals(vertices: any, normals: any) {
    const buffGeometry = new THREE.BufferGeometry();
    buffGeometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    buffGeometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
    const material = this.getMaterial();
    this.mesh = new THREE.Mesh(buffGeometry, material);
    //we need to apply the scale of first objet (or we loose it)
    this.mesh.scale.set(this.children[0].getMesh().scale.x, this.children[0].getMesh().scale.y,this.children[0].getMesh().scale.z);
    this._updateRequired = false;
    //check if there are penging operations
    if (this.pendingOperation) {
      this.applyOperations();
    }
  }

  protected toBufferArray():Array<ArrayBuffer>{
    const bufferArray:Array<ArrayBuffer> = [];
    this.children.forEach(child => {
      const geom: THREE.Geometry = child.getMesh().geometry as THREE.Geometry;
      const bufferGeom: THREE.BufferGeometry = new THREE.BufferGeometry().fromGeometry(geom);
      const verticesBuffer: ArrayBuffer = new Float32Array(bufferGeom.getAttribute('position').array).buffer;
      const normalsBuffer: ArrayBuffer = new Float32Array(bufferGeom.getAttribute('normal').array).buffer;
      bufferArray.push(verticesBuffer);
      bufferArray.push(normalsBuffer);
    });
    return bufferArray;
  }

  public addChildren(child: Object3D): void {
    this.children.push(child);
    this._updateRequired = true;
  }

  public setChildren(children: ChildrenArray): void {
    if(!isEqual(children,this.children)){
      this.children = children.slice();
      this._updateRequired = true;
    }
  }


}
