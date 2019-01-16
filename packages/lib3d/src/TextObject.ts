/**
 * License: MIT
 *
 * long description for the file
 *
 * @summary short description for the file
 * @author Alberto Valero <https://github.com/avalero>
 *
 * Created at     : 2019-01-15 16:22:05
 * Last modified  : 2019-01-16 10:21:28
 */

import isEqual from 'lodash.isequal';
import * as THREE from 'three';
import ObjectsCommon, {
  IObjectsCommonJSON,
  IViewOptions,
  OperationsArray,
} from './ObjectsCommon';
import PrimitiveObject from './PrimitiveObject';

import gentilis_regular from './fonts/gentilis_regular.typeface';

export interface ITextObjectParams {
  text: string;
  height: number;
  size: number;
  font: string;
}

export interface ITextObjectJSON extends IObjectsCommonJSON {
  parameters: ITextObjectParams;
}

export default class TextObject extends PrimitiveObject {
  public static typeName: string = 'TextObject';

  public static newFromJSON(object: ITextObjectJSON): TextObject {
    if (object.type !== TextObject.typeName) {
      throw new Error('Not Text Object');
    }
    const text = new TextObject(
      object.parameters,
      object.operations,
      object.viewOptions,
    );
    text.id = object.id || '';

    return text;
  }

  constructor(
    parameters: Partial<ITextObjectParams>,
    operations: OperationsArray = [],
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    mesh?: THREE.Mesh | undefined,
  ) {
    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...viewOptions,
    };
    super(vO, operations);
    this.type = TextObject.typeName;
    const params = {
      font: 'gentilis',
      ...parameters,
    };
    this.setParameters(params);
    this.lastJSON = this.toJSON();
    if (mesh) {
      this.setMesh(mesh);
    } else {
      this.meshPromise = this.computeMeshAsync();
    }
  }

  public clone(): TextObject {
    if (this.mesh && isEqual(this.lastJSON, this.toJSON())) {
      const objText = new TextObject(
        this.parameters as ITextObjectParams,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone(),
      );
      return objText;
    }
    const obj = new TextObject(
      this.parameters as ITextObjectParams,
      this.operations,
      this.viewOptions,
    );
    return obj;
  }

  protected getGeometry(): THREE.Geometry {
    let { text, height, size } = this.parameters as ITextObjectParams;
    height = Math.max(0.1, height);
    size = Math.max(0.1, size);
    text = text || 'TEXT';

    this._meshUpdateRequired = false;
    return new THREE.TextGeometry(text, {
      size,
      height,
      font: new THREE.Font(gentilis_regular),
    });
  }
}
