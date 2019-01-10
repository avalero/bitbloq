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
 * Last modified  : 2019-01-10 10:26:48
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
        filetype: 'emtpy',
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

  protected getGeometry(): THREE.Geometry {
    if (
      !(this.parameters as ISTLParams).blob ||
      (this.parameters as ISTLParams).blob.filetype.match('empty')
    ) {
      // TODO . Manage when there is no file
      return new THREE.BoxGeometry(1, 1, 1);
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
}
