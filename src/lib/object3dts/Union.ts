/**
 * Copyright (c) 2018 Bitbloq (BQ)
 *
 * License: MIT
 *
 * long description for the file
 *
 * @summary short description for the file
 * @author David García <https://github.com/empoalp>, Alberto Valero <https://github.com/avalero>
 *
 * Created at     : 2018-10-16 13:00:09 
 * Last modified  : 2018-10-24 20:44:21
 */



import * as THREE from 'three';

import CompoundObject from './CompoundObject';
import {ChildrenArray} from './Object3D'
import {ThreeBSP} from './threeCSG';



export default class Union extends CompoundObject {
  static typeName:string = 'Union';

  constructor(children: ChildrenArray = [], operations: OperationsArray = []){
    super(children, operations);
  }

  public getMeshAsync(): Promise<THREE.Mesh> {
    const self:Union = this;
    return new Promise(function (resolve, reject){
      if(self.updateRequired){
        console.log('update Union Mesh');
        if (typeof(Worker) !== "undefined"){
          //WEB WORKER
          self.worker.onmessage = (event:any) => {
            const t0 = performance.now();
            const message = event.data;
            //recompute object form vertices and normals
            const vertices = message.vertices;
            const normals = message.normals;

            const buffGeometry = new THREE.BufferGeometry();
            buffGeometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
            buffGeometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );

            const material = self.getMaterial();

            self.mesh = new THREE.Mesh( buffGeometry, material );

            //we need to apply the scale of first objet (or we loose it)
            self.mesh.scale.set(
              self.children[0].getMesh().scale.x,
              self.children[0].getMesh().scale.y,
              self.children[0].getMesh().scale.z,
            );

            self._updateRequired = false;
            
            //check if there are penging operations
            if (self.pendingOperation){
              self.applyOperations();
            }

            const t1 = performance.now();
            console.log(`WebWorker receive message Execuetion time ${t1 - t0} millis`);
            if(self.mesh instanceof THREE.Mesh){
              resolve(self.mesh);
            }else{
              const reason = new Error('Mesh not computed correctly');
              reject(reason);
            }
          };
          //Lets create an array of vertices and normals for each child
          const t0 = performance.now();
          const bufferArray: Array<ArrayBuffer> = [];
          self.children.forEach(child => {
            const geom: THREE.Geometry = child.getMesh().geometry as THREE.Geometry;
            const bufferGeom: THREE.BufferGeometry = new THREE.BufferGeometry().fromGeometry(geom);
            const verticesBuffer: ArrayBuffer = new Float32Array(bufferGeom.getAttribute('position').array).buffer;
            const normalsBuffer: ArrayBuffer = new Float32Array(bufferGeom.getAttribute('normal').array).buffer;
            bufferArray.push(verticesBuffer);
            bufferArray.push(normalsBuffer);
          });

          const message = {
            type: 'union',
            numChildren: self.children.length,
            bufferArray,
          }
          self.worker.postMessage(message, bufferArray);
          const t1 = performance.now();
          console.log(`WebWorker post message Execuetion time ${t1 - t0} millis`);
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

  private getUnionMeshBSP():any{
    let unionMeshBSP:any = new ThreeBSP(this.children[0].getMesh());  
    // Union with the rest
    for (let i = 1; i < this.children.length; i += 1) {
      const bspMesh = new ThreeBSP(this.children[i].getMesh());
      unionMeshBSP = unionMeshBSP.union(bspMesh);
    }

    return unionMeshBSP;

  }

  public getMesh():THREE.Mesh {
    if(this.updateRequired){
      // First element of array
      const unionMeshBSP = this.getUnionMeshBSP();
      this.mesh = unionMeshBSP.toMesh(this.getMaterial());
      //we need to apply the scale of first objet (or we loose it)
      this.mesh.scale.set(
        this.children[0].getMesh().scale.x,
        this.children[0].getMesh().scale.y,
        this.children[0].getMesh().scale.z,
      );
      this._updateRequired = false;
    }

    if (this.pendingOperation){
      this.applyOperations();
    }

  
    return this.mesh;
  }
}
