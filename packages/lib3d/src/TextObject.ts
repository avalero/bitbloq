/**
 * License: MIT
 *
 * long description for the file
 *
 * @summary short description for the file
 * @author Alberto Valero <https://github.com/avalero>
 *
 * Created at     : 2019-01-15 16:22:05
 * Last modified  : 2019-01-31 10:31:10
 */

import * as THREE from "three";
import ObjectsCommon from "./ObjectsCommon";
import PrimitiveObject from "./PrimitiveObject";

import {
  ITextObjectJSON,
  ITextObjectParams,
  IViewOptions,
  OperationsArray
} from "./Interfaces";

import audiowide_regular from "./assets/fonts/audiowide_regular.json";
import fredoka_one_regular from "./assets/fonts/fredoka_one_regular.json";
import merriweather_regular from "./assets/fonts/merriweather_regular.json";
import pressstart2p_regular from "./assets/fonts/pressstart2p_regular.json";
import roboto_regular from "./assets/fonts/roboto_regular.json";

export default class TextObject extends PrimitiveObject {
  public static typeName: string = "TextObject";

  public static newFromJSON(object: ITextObjectJSON): TextObject {
    if (object.type !== TextObject.typeName) {
      throw new Error("Not Text Object");
    }
    const text = new TextObject(
      object.parameters,
      object.operations,
      object.viewOptions
    );
    text.id = object.id || text.id;

    return text;
  }

  constructor(
    parameters: Partial<ITextObjectParams>,
    operations: OperationsArray = [],
    viewOptions: Partial<IViewOptions> = ObjectsCommon.createViewOptions(),
    mesh?: THREE.Mesh | undefined
  ) {
    const vO = {
      ...ObjectsCommon.createViewOptions(),
      ...viewOptions
    };
    super(vO, operations);
    this.type = TextObject.typeName;
    const params = {
      font: "gentilis_regular",
      ...parameters
    };
    this.setParameters(params);

    if (mesh) {
      this.setMesh(mesh);
    } else {
      this.computeMesh();
      this.meshPromise = null;
    }
  }

  public clone(): TextObject {
    if (this.mesh && !(this.meshUpdateRequired || this.pendingOperation)) {
      const objText = new TextObject(
        this.parameters as ITextObjectParams,
        this.operations,
        this.viewOptions,
        (this.mesh as THREE.Mesh).clone()
      );
      return objText;
    }
    const obj = new TextObject(
      this.parameters as ITextObjectParams,
      this.operations,
      this.viewOptions
    );
    return obj;
  }

  protected getGeometry(): THREE.Geometry {
    let { text, thickness, size } = this.parameters as ITextObjectParams;
    thickness = Math.max(0.1, thickness);
    size = Math.max(0.1, size);
    text = text || "TEXT";

    let font: THREE.Font;
    try {
      switch ((this.parameters as ITextObjectParams).font) {
        case "audiowide_regular":
          font = new THREE.Font(audiowide_regular);
          break;
        case "fredoka_one_regular":
          font = new THREE.Font(fredoka_one_regular);
          break;
        case "merriweather_regular":
          font = new THREE.Font(merriweather_regular);
          break;
        case "pressstart2p_regular":
          font = new THREE.Font(pressstart2p_regular);
          break;
        case "roboto_regular":
          font = new THREE.Font(roboto_regular);
          break;
        default:
          font = new THREE.Font(roboto_regular);
      }
    } catch (e) {
      throw new Error(
        `Cannot create font ${
          (this.parameters as ITextObjectParams).font
        }: ${e}`
      );
    }

    this.meshUpdateRequired = false;

    try {
      const geom = new THREE.TextGeometry(text, {
        size,
        font,
        height: thickness
      });

      return geom;
    } catch (e) {
      throw new Error(`Cannot create ${this.getTypeName()} geometry: ${e}`);
    }
  }
}
