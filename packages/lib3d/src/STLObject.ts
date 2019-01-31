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
 * Created at     : 2018-10-16 12:59:08
 * Last modified  : 2019-01-31 10:05:22
 */

import * as THREE from 'three';
import ObjectsCommon from './ObjectsCommon';

import PrimitiveObject from './PrimitiveObject';
import STLLoader from './STLLoader';

import {
  ISTLJSON,
  ISTLParams,
  IViewOptions,
  OperationsArray,
} from './Interfaces';

export default class STLObject extends PrimitiveObject {
  public static typeName: string = 'STLObject';

  public static newFromJSON(object: ISTLJSON): STLObject {
    if (object.type !== STLObject.typeName) {
      throw new Error('Not STL Object');
    }

    const stl = new STLObject(
      object.parameters,
      object.operations,
      object.viewOptions,
    );

    stl.id = object.id || stl.id;

    return stl;
  }

  private arrayBufferData: ArrayBuffer;
  private geometry: THREE.Geometry;

  constructor(
    parameters: Partial<ISTLParams>,
    operations: OperationsArray = [],
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    mesh?: THREE.Mesh | undefined,
  ) {
    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...viewOptions,
    };
    super(vO, operations);
    this.type = STLObject.typeName;

    const params: ISTLParams = {
      ...parameters,
      blob: parameters.blob || {
        uint8Data: new Uint8Array(0),
        filetype: 'empty',
        newfile: false,
      },
    };

    this.setParameters(params);

    if (mesh) {
      this.setMesh(mesh);
    } else {
      this.meshPromise = this.computeMeshAsync();
    }
  }

  get meshUpdateRequired(): boolean {
    return (this.parameters as ISTLParams).blob.newfile;
  }

  set meshUpdateRequired(a: boolean) {
    (this.parameters as ISTLParams).blob.newfile = a;
  }

  public clone(): STLObject {
    if (
      this.mesh &&
      !(
        this.meshUpdateRequired ||
        this.pendingOperation ||
        this.viewOptionsUpdateRequired
      )
    ) {
      const objSTL = new STLObject(
        this.parameters as ISTLParams,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone(),
      );
      return objSTL;
    }

    const obj = new STLObject(
      this.parameters as ISTLParams,
      this.operations,
      this.viewOptions,
    );
    return obj;
  }

  public async computeMeshAsync(): Promise<THREE.Mesh> {
    this.meshPromise = new Promise(async (resolve, reject) => {
      if (
        !(this.parameters as ISTLParams).blob ||
        (this.parameters as ISTLParams).blob.filetype.match('empty')
      ) {
        this.mesh = this.getNoFileMesh();
        this.meshUpdateRequired = false;
        resolve(this.mesh);
        return;
      }

      if (this.meshUpdateRequired) {
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

  protected setParameters(parameters: ISTLParams): void {
    if (!this.parameters) {
      this.parameters = { ...parameters };
      this.meshUpdateRequired = true;
      return;
    }

    if (parameters.blob.newfile) {
      this.parameters = { ...parameters };
      this.meshUpdateRequired = true;
      return;
    }
  }

  protected getGeometry(): THREE.Geometry {
    if (
      !(this.parameters as ISTLParams).blob ||
      (this.parameters as ISTLParams).blob.filetype.match('empty')
    ) {
      throw new Error(`No STL file loaded`);
    }

    // recompute geometry only if blob has changed (new file loaded)
    if ((this.parameters as ISTLParams).blob.newfile) {
      try {
        return this.computeGeometry();
      } catch (e) {
        throw e;
      }
    }
    return this.geometry;
  }

  private computeGeometry(): THREE.Geometry {
    const data: Uint8Array = (this.parameters as ISTLParams).blob.uint8Data;
    this.arrayBufferData = data.buffer;
    const filetype: string = (this.parameters as ISTLParams).blob.filetype;

    if (filetype.match('model/x.stl-binary') || filetype.match('model/stl')) {
      this.geometry = STLLoader.loadBinaryStl(this.arrayBufferData);
      if (this.geometry instanceof THREE.Geometry) {
        return this.geometry;
      }

      throw new Error('Geometry not properly computed');
    }

    if (filetype.match('model/x.stl-ascii')) {
      this.geometry = STLLoader.loadTextStl(this.arrayBufferData);
      if (this.geometry instanceof THREE.Geometry) {
        return this.geometry;
      }

      throw new Error('Geometry not properly computed');
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
        canvas.height / 2,
      );
    }

    const texture = new THREE.Texture(canvas);
    texture.center = new THREE.Vector2(0.5, 0.5);
    texture.rotation = rotation;
    texture.needsUpdate = true;
    return texture;
  }
}
