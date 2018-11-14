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
 * Created at     : 2018-10-02 18:56:46
 * Last modified  : 2018-11-14 10:54:19
 */

import * as THREE from 'three';
import isEqual from 'lodash.isequal';
import ObjectsCommon from './ObjectsCommon'
import {ITranslateOperation, IRotateOperation, IMirrorOperation, IScaleOperation, OperationsArray} from './ObjectsCommon';

export type ChildrenArray = Array<Object3D>

export default class Object3D extends ObjectsCommon{

  public static getVerticesFromGeom(geometry:THREE.Geometry):ArrayLike<number>{
    const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
    const attribute = bufferGeometry.getAttribute("position");
    
    return attribute.array;
  }

  public static getNormalsFromGeom(geometry:THREE.Geometry):ArrayLike<number>{
    const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
    const attribute = bufferGeometry.getAttribute("normal");
    
    return attribute.array;
  }

  public static getMeshFromVerticesNormals(vertices:ArrayLike<number> , normals:ArrayLike<number> , material: THREE.MeshLambertMaterial):THREE.Mesh{
    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    geometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
    const mesh:THREE.Mesh = new THREE.Mesh(geometry, material);

    return mesh;
  }


  

  //protected mesh: THREE.Mesh;
  protected mesh: THREE.Mesh;
  protected color: string;
  
  protected _updateRequired: boolean;
  protected children: ChildrenArray;

  constructor(operations: OperationsArray = []) {
    super(operations);
    this.children = [];
    this.color = "#ffffff";
  }

  get updateRequired():boolean{
    this.children.forEach( child => {
      this._updateRequired = this._updateRequired || child.updateRequired || child.pendingOperation;
    });

    return this._updateRequired;
  }

  get pendingOperation():boolean{
    this.children.forEach( child => {
      this._pendingOperation = this._pendingOperation || child.pendingOperation;
    });

    return this._pendingOperation;
  }

  public setColor(color: string): void {
    this.color = color;
    if (this.mesh) {
      this.mesh.material = this.getMaterial();
    }
  }

  protected getMaterial(): THREE.MeshLambertMaterial {
    return new THREE.MeshLambertMaterial({
      color: this.color,
    });
  }

  public getPrimitiveMesh(): THREE.Mesh {
    if (this.updateRequired) {
      //console.log("Recompute Mesh");
      const geometry: THREE.Geometry = this.getGeometry();
      //const bufferGeometry: THREE.BufferGeometry = this.getBufferGeometry();
      this.mesh = new THREE.Mesh(geometry, this.getMaterial());
      this._updateRequired = false;
      this.applyOperations();
    }

    if (this.pendingOperation){
      this.applyOperations();
    }

    return this.mesh;
  }

  public async getMeshAsync(): Promise<THREE.Mesh> {
      // for generic Object3D make it sync
      const mesh = this.getPrimitiveMesh();
      if(mesh instanceof THREE.Mesh){
        return mesh;
      }else{
        throw new Error('Mesh not computed correctly');
      }
  }

  protected getGeometry(): THREE.Geometry {
    throw new Error('ERROR. Pure Virtual Function implemented in children');
  }

  protected getBufferGeometry(): THREE.BufferGeometry {
    throw new Error('ERROR. Pure Virtual Function implemented in children');
  }

  public setOperations(operations: OperationsArray = []): void {
    this._pendingOperation = this.pendingOperation || !isEqual(this.operations, operations);

    if(!isEqual(this.operations, operations)){
      this.operations = [];
      this.operations = operations.slice();
    }
  }


  protected async applyOperations():Promise<void> {
    
    if( !this.pendingOperation ) return;
    
    //if there are children, mesh is centered at first child position/rotation
    if(this.children.length > 0){
      const ch_mesh = await this.children[0].getMeshAsync();
      this.mesh.position.x = ch_mesh.position.x;
      this.mesh.position.y = ch_mesh.position.y;
      this.mesh.position.z = ch_mesh.position.z;
      this.mesh.quaternion.set(ch_mesh.quaternion.x, ch_mesh.quaternion.y, ch_mesh.quaternion.z, ch_mesh.quaternion.w);
    }else{
      this.mesh.position.set(0,0,0);
      this.mesh.quaternion.setFromEuler(new THREE.Euler(0,0,0),true);
    }

    this.operations.forEach(operation => {
      // Translate operation
      if (operation.type === Object3D.createTranslateOperation().type) {
        this.applyTranslateOperation(operation as ITranslateOperation);
      } else if (operation.type === Object3D.createRotateOperation().type) {
        this.applyRotateOperation(operation as IRotateOperation);
      } else if (operation.type === Object3D.createScaleOperation().type) {
        this.applyScaleOperation(operation as IScaleOperation);
      } else if (operation.type === Object3D.createMirrorOperation().type){
        this.applyMirrorOperation(operation as IMirrorOperation);
      } else {
        throw Error('ERROR: Unknown Operation');
      }
    });
    this._pendingOperation = false;
    return;
  }

  private applyMirrorOperation(operation: IMirrorOperation): void{
    if(operation.plane === 'xy'){
      this.applyScaleOperation(Object3D.createScaleOperation(1,1,-1));
    }else if(operation.plane === 'yz'){
      this.applyScaleOperation(Object3D.createScaleOperation(-1,1,1));
    }else if(operation.plane === 'zx'){
      this.applyScaleOperation(Object3D.createScaleOperation(1,-1,1));
    }
  }

  private applyTranslateOperation(operation: ITranslateOperation): void {
    if (operation.relative) {
      this.mesh.translateX(operation.x);
      this.mesh.translateY(operation.y);
      this.mesh.translateZ(operation.z);
    } else {
      //absolute x,y,z axis.
      this.mesh.position.x += Number(operation.x);
      this.mesh.position.y += Number(operation.y);
      this.mesh.position.z += Number(operation.z);
    }
  }

  private applyRotateOperation(operation: IRotateOperation): void {
    const angle = THREE.Math.degToRad(Number(operation.angle));
    switch (operation.axis) {
      case 'x':
        if (operation.relative) {
          this.mesh.rotateX(angle);
        } else {
          this.mesh.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), angle);
        }
        break;

      case 'y':
        if (operation.relative) {
          this.mesh.rotateY(angle);
        } else {
          this.mesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), angle);
        }
        break;

      case 'z':
        if (operation.relative) {
          this.mesh.rotateZ(angle);
        } else {
          this.mesh.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), angle);
        }
        break;

      default:
        throw new Error('Unexpected Rotation Axis');
    }
  }

  private applyScaleOperation(operation: IScaleOperation): void {
    if ( 
      Number(operation.x) > 0 &&
      Number(operation.y) > 0 &&
      Number(operation.z) > 0
    )
      this.mesh.scale.set(
        this.mesh.scale.x * Number(operation.x),
        this.mesh.scale.y * Number(operation.y),
        this.mesh.scale.z * Number(operation.z),
      );
  }
  
  public clone():Object3D{
    throw new Error('Implemented in children');
  }


}
