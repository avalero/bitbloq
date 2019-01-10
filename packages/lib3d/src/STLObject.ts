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
 * Last modified  : 2019-01-10 18:32:53
 */

import isEqual from 'lodash.isequal';
import * as THREE from 'three';
import ObjectsCommon, {
  IViewOptions,
  OperationsArray,
  IObjectsCommonJSON,
} from './ObjectsCommon';
import cloneDeep from 'lodash.clonedeep';

import PrimitiveObject, { IPrimitiveObjectJSON } from './PrimitiveObject';
import STLLoader from './STLLoader';

interface ISTLParams {
  blob: {
    buffer: ArrayBuffer;
    filetype: string;
  };
}

export interface ISTLJSON extends IObjectsCommonJSON {
  parameters: ISTLParams;
}

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

    stl.id = object.id || '';

    return stl;
  }

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
        buffer: new ArrayBuffer(0),
        filetype: 'empty',
      },
    };

    this.setParameters(params);
    this.lastJSON = this.toJSON();
    if (mesh) {
      this.setMesh(mesh);
    } else {
      this.meshPromise = this.computeMeshAsync();
    }
  }

  public clone(): STLObject {
    if (this.mesh && isEqual(this.lastJSON, this.toJSON())) {
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
        // TODO . PREGUNTAR A DAVID!!!!
        this.mesh = this.getNoFileMesh();
        this._meshUpdateRequired = false;
        resolve(this.mesh);
        return;
      }

      if (this.meshUpdateRequired) {
        const geometry: THREE.Geometry = this.getGeometry();
        this.mesh = new THREE.Mesh(geometry);
        this._meshUpdateRequired = false;
        this.applyViewOptions();
        await this.applyOperationsAsync();
      }

      if (this.pendingOperation) {
        await this.applyOperationsAsync();
      }

      if (this.viewOptionsUpdateRequired) {
        this.applyViewOptions();
      }

      resolve(this.mesh);
    });

    return this.meshPromise as Promise<THREE.Mesh>;
  }

  protected getGeometry(): THREE.Geometry {
    if (
      !(this.parameters as ISTLParams).blob ||
      (this.parameters as ISTLParams).blob.filetype.match('empty')
    ) {
      throw new Error('No STL file loaded');
    }

    const blob = (this.parameters as ISTLParams).blob.buffer;

    if (
      (this.parameters as ISTLParams).blob.filetype.match('model/x.stl-binary')
    ) {
      const binaryGeom: THREE.Geometry = STLLoader.loadBinaryStl(blob);
      return binaryGeom;
    }

    if (
      (this.parameters as ISTLParams).blob.filetype.match('model/x.stl-ascii')
    ) {
      const asciiGeom = STLLoader.loadTextStl(blob);
      return asciiGeom;
    }

    throw new Error(
      `No STL file format: ${(this.parameters as ISTLParams).blob.filetype} `,
    );
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
