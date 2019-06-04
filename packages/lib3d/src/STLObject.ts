/*
 * File: STLObject.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Copyright 2018 - 2019 BQ Educacion.
 * -----
 * File Created: Monday, 25th February 2019
 * Last Modified:: Monday, 25th February 2019 9:59:21 am
 * -----
 * Author: David García (david.garciaparedes@bq.com)
 * Author: Alda Martín (alda.marting@bq.com)
 * Author: Alberto Valero (alberto.valero@bq.com)
 * -----
 */

import * as THREE from 'three';
import ObjectsCommon from './ObjectsCommon';
import PrimitiveObject from './PrimitiveObject';
import STLLoader from './STLLoader';

import {
  IPrimitiveObjectJSON,
  ISTLJSON,
  ISTLParams,
  IViewOptions,
  OperationsArray,
} from './Interfaces';

export default class STLObject extends PrimitiveObject {
  get meshUpdateRequired(): boolean {
    const params = this.parameters as ISTLParams;
    if (params.blob) {
      return params.blob.newfile || this._meshUpdateRequired;
    }

    return this._meshUpdateRequired;
  }

  set meshUpdateRequired(a: boolean) {
    this._meshUpdateRequired = a;
  }
  public static typeName: string = 'STLObject';

  public static newFromJSON(object: ISTLJSON): STLObject {
    if (object.type !== STLObject.typeName) {
      throw new Error('Not STL Object');
    }

    let stl: STLObject;
    let mesh: THREE.Mesh;
    if (object.mesh) {
      mesh = new THREE.ObjectLoader().parse(object.mesh);
      stl = new STLObject(
        object.parameters,
        object.operations,
        object.viewOptions,
        mesh
      );
    } else {
      stl = new STLObject(
        object.parameters,
        object.operations,
        object.viewOptions
      );
    }

    stl.id = object.id || stl.id;

    return stl;
  }

  private arrayBufferData: ArrayBuffer;
  private geometry: THREE.Geometry;
  private url: string;

  constructor(
    parameters: Partial<ISTLParams>,
    operations: OperationsArray = [],
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    mesh?: THREE.Mesh | undefined
  ) {
    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...viewOptions,
    };
    super(vO, operations);
    this.type = STLObject.typeName;

    const params: ISTLParams = {
      ...parameters,
      url: parameters.url,
      blob: parameters.blob,
    };

    // if we have url we prioritize it wrt. blob
    if (params.url) {
      delete params.blob;
    }

    this.setParameters(params);

    if (mesh) {
      this.setMesh(mesh);
    } else {
      if ((this.parameters as ISTLParams).blob) {
        this.computeMesh();
        this.meshPromise = null;
      } else {
        this.meshPromise = this.computeMeshAsync();
      }
    }
  }

  public clone(): STLObject {
    if (this.mesh && !(this.meshUpdateRequired || this.pendingOperation)) {
      const objSTL = new STLObject(
        this.parameters as ISTLParams,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone()
      );
      return objSTL;
    }

    const obj = new STLObject(
      this.parameters as ISTLParams,
      this.operations,
      this.viewOptions
    );
    return obj;
  }

  public async computeMeshAsync(): Promise<THREE.Mesh> {
    const params = this.parameters as ISTLParams;
    this.meshPromise = new Promise(async (resolve, reject) => {
      // No stl file defined
      if (
        (!params.url && !params.blob) ||
        (params.blob && params.blob.filetype.match('empty'))
      ) {
        this.mesh = this.getNoFileMesh();
        this.meshUpdateRequired = false;
        resolve(this.mesh);
        return;
      }

      // file defined by url
      if (params.url && this.meshUpdateRequired) {
        const url = params.url;
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        this.geometry = STLLoader.loadBinaryStl(arrayBuffer);
        this.centerGeometry();
        this.mesh = new THREE.Mesh(this.geometry);
        this.applyViewOptions();
        await this.applyOperationsAsync();
        resolve(this.mesh);
        this.meshUpdateRequired = false;
        this.pendingOperation = false;
        this.viewOptionsUpdateRequired = false;
        return;
      }

      // else -> file defined by blob
      if (params.blob && this.meshUpdateRequired) {
        const geometry: THREE.Geometry = this.getGeometry();
        this.mesh = new THREE.Mesh(geometry);
        this.applyViewOptions();
        await this.applyOperationsAsync();
        resolve(this.mesh);
        this.meshUpdateRequired = false;
        this.pendingOperation = false;
        this.viewOptionsUpdateRequired = false;
        return;
      }

      if (this.pendingOperation) {
        await this.applyOperationsAsync();
      }

      if (this.viewOptionsUpdateRequired) {
        this.applyViewOptions();
      }

      resolve(this.mesh);
      this.meshUpdateRequired = false;
      this.pendingOperation = false;
      this.viewOptionsUpdateRequired = false;
    });

    return this.meshPromise as Promise<THREE.Mesh>;
  }

  public toJSON(): IPrimitiveObjectJSON {
    const base = super.toJSON();
    const blob = (base.parameters as ISTLParams).blob;
    if (blob && blob.uint8Data instanceof Uint8Array) {
      return {
        ...base,
        parameters: {
          ...base.parameters,
          blob: {
            ...blob,
            uint8Data: Array.from(blob.uint8Data),
          },
        },
      };
    }
    return base;
  }

  protected setParameters(parameters: ISTLParams): void {
    if (!this.parameters) {
      this.parameters = { ...parameters };
      this.url = parameters.url || '';
      this.meshUpdateRequired = true;
      return;
    }

    // If object is set by url remove blob (if exists)
    if (parameters.url) {
      delete parameters.blob;
      if (parameters.url !== this.url) {
        this.url = parameters.url;
        this.meshUpdateRequired = true;
        return;
      }
    }

    if (parameters.blob && parameters.blob.newfile) {
      this.parameters = { ...parameters };
      this.meshUpdateRequired = true;
      return;
    }
  }

  protected getGeometry(): THREE.Geometry {
    const params = this.parameters as ISTLParams;

    if (!params.blob || params.blob.filetype.match('empty')) {
      throw new Error(`No STL file loaded`);
    }

    // recompute geometry only if blob has changed (new file loaded)
    if (params.blob.newfile) {
      try {
        return this.computeGeometry();
      } catch (e) {
        throw e;
      }
    }
    return this.geometry;
  }

  private centerGeometry(): void {
    this.geometry.computeBoundingBox();
    const box: THREE.Box3 = this.geometry.boundingBox;
    const center: THREE.Vector3 = new THREE.Vector3();
    box.getCenter(center);
    this.geometry.translate(-center.x, -center.y, -box.min.z);
  }

  private computeGeometry(): THREE.Geometry {
    const params = this.parameters as ISTLParams;
    if (!params.blob) throw new Error(`No blob to compute`);

    const uint8Data = params.blob.uint8Data;
    let data: Uint8Array = new Uint8Array([]);

    if (uint8Data instanceof Uint8Array) {
      data = uint8Data;
    }

    if (uint8Data instanceof Array) {
      data = new Uint8Array(uint8Data);
    }

    this.arrayBufferData = data.buffer;
    const filetype: string = params.blob.filetype;

    if (
      filetype.match('model/x.stl-binary') ||
      filetype.match('model/stl') ||
      filetype.match('application/sla') ||
      filetype.match('application/octet-stream')
    ) {
      try {
        this.geometry = STLLoader.loadBinaryStl(this.arrayBufferData);
      } catch (e) {
        throw new Error('Cannot parse STL file');
      }
    } else if (filetype.match('model/x.stl-ascii')) {
      try {
        this.geometry = STLLoader.loadTextStl(this.arrayBufferData);
      } catch (e) {
        throw new Error('Cannot parse STL file');
      }
    } else {
      // unlisted filetype
      try {
        // try ascii
        console.warn(`Unknown filetype ${filetype}, trying binary stl`);
        this.geometry = STLLoader.loadBinaryStl(this.arrayBufferData); // try binar
      } catch (e) {
        console.warn(`Unable to parse STL file: ${e}`);
        console.warn(`Unknown filetype ${filetype}, trying text stl`);
        this.geometry = STLLoader.loadTextStl(this.arrayBufferData); // try ascii
      }
    }

    if (this.geometry instanceof THREE.Geometry) {
      this.centerGeometry();
      return this.geometry;
    }

    throw new Error(`No STL file format: filetype: ${filetype} `);
  }

  private getNoFileMesh(): THREE.Mesh {
    const HALF_PI = Math.PI / 2;

    const boxGeometry = new THREE.BoxGeometry(10, 10, 10).translate(0, 0, 5);
    const cubeMaterials = [
      new THREE.MeshLambertMaterial({
        map: this.getTextureForText('STL', HALF_PI),
      }),
      new THREE.MeshLambertMaterial({
        map: this.getTextureForText('STL', -HALF_PI),
      }),
      new THREE.MeshLambertMaterial({
        map: this.getTextureForText('STL', Math.PI),
      }),
      new THREE.MeshLambertMaterial({
        map: this.getTextureForText('STL'),
      }),
      new THREE.MeshLambertMaterial({
        map: this.getTextureForText('STL'),
      }),
      new THREE.MeshLambertMaterial({
        map: this.getTextureForText('STL', Math.PI),
      }),
    ];
    const cube = new THREE.Mesh(boxGeometry, cubeMaterials);

    return cube;
  }

  private getTextureForText(text: string, rotation: number = 0): THREE.Texture {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 128;
    canvas.height = 128;

    if (ctx) {
      ctx.font = '20px Roboto,Arial';
      ctx.fillStyle = '#cccccc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        (text || '').toUpperCase(),
        canvas.width / 2,
        canvas.height / 2
      );
    }

    const texture = new THREE.Texture(canvas);
    texture.center = new THREE.Vector2(0.5, 0.5);
    texture.rotation = rotation;
    texture.needsUpdate = true;
    return texture;
  }
}
