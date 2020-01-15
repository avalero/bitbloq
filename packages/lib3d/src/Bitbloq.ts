/*
 * File: Bitbloq.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Bitbloq Repository: https://github.com/bitbloq
 * Bitbloq Team: https://github.com/orgs/Bitbloq/people
 * Copyright 2018 - 2019 BQ Educacion.
 */

import * as THREE from "three";
import { isEqual } from "lodash";
import {
  ITranslateOperation,
  IRotateOperation,
  IScaleOperation,
  IMirrorOperation,
  IRepetitionObjectJSON,
  IObjectsGroupJSON,
  ITextObjectJSON,
  ICompoundObjectJSON,
  ICubeJSON,
  ICylinderJSON,
  IObjectsCommonJSON,
  IPrismJSON,
  IPyramidJSON,
  ISphereJSON,
  ISTLJSON,
  IPrimitiveObjectJSON,
  OperationsArray
} from "./Interfaces";

import Object3D from "./Object3D";
import ObjectsCommon from "./ObjectsCommon";

type objJSON =
  | IRepetitionObjectJSON
  | IObjectsGroupJSON
  | ITextObjectJSON
  | ICompoundObjectJSON
  | ICubeJSON
  | ICylinderJSON
  | IObjectsCommonJSON
  | IPrismJSON
  | IPyramidJSON
  | ISphereJSON
  | ISTLJSON;

export function equalJSON(obj1: objJSON, obj2: objJSON): boolean {
  const primitiveTypes: string[] = [
    "Cube",
    "Cylinder",
    "Sphere",
    "Prism",
    "TextObject",
    "Pyramid",
    "Cone",
    "TruncatedCone",
    "SemiCylinder",
    "Torus",
    "Octahedron",
    "RectPrism",
    "Star",
    "Heart",
    "Tube"
  ];

  const compoundObjectTypes: string[] = ["Union", "Difference", "Intersection"];

  const stlType = "STLObject";
  const predesignedType = "PredesignedObject";

  const obj1Basics = {
    id: obj1.id,
    operations: obj1.operations,
    type: obj1.type
  };

  const obj2Basics = {
    id: obj2.id,
    operations: obj2.operations,
    type: obj2.type
  };

  // check common parameters
  if (!isEqual(obj1Basics, obj2Basics)) {
    return false;
  }
  // from here we know both have same type, same operations, same id

  // If they are primitive types, use standard lodash.isEqual to compare Parameters
  if (primitiveTypes.includes(obj1.type)) {
    return isEqual(
      (obj1 as IPrimitiveObjectJSON).parameters,
      (obj2 as IPrimitiveObjectJSON).parameters
    );
  }

  // If STLObject, check if any of them is a newFile
  if (obj1.type === stlType || obj1.type === predesignedType) {
    // TODO
    // I am not sure if this works. I am too tired

    const json1 = obj1 as ISTLJSON;
    const json2 = obj2 as ISTLJSON;

    if (json1.parameters.url && json2.parameters.url) {
      return json1.parameters.url === json2.parameters.url;
    }

    return !(
      (json1.parameters.blob && json1.parameters.blob.newfile) ||
      (json2.parameters.blob && json2.parameters.blob.newfile)
    );
  }

  // CompoundObject
  if (compoundObjectTypes.includes(obj1.type)) {
    const obj1Comp: ICompoundObjectJSON = obj1 as ICompoundObjectJSON;
    const obj2Comp: ICompoundObjectJSON = obj2 as ICompoundObjectJSON;

    // check if children are the same
    return compareObjectsJSONArray(obj1Comp.children, obj2Comp.children);
  }

  // RepetitionObject
  if (obj1.type === "RepetitionObject") {
    const obj1Rep = obj1 as IRepetitionObjectJSON;
    const obj2Rep = obj2 as IRepetitionObjectJSON;

    // compare params
    if (!isEqual(obj1Rep.parameters, obj2Rep.parameters)) {
      return false;
    }

    // compare repeated object (children[0])
    return equalJSON(obj1Rep.children[0], obj2Rep.children[0]);
  }

  // Group

  if (obj1.type === "ObjectsGroup") {
    const obj1Group: IObjectsGroupJSON = obj1 as IObjectsGroupJSON;
    const obj2Group: IObjectsGroupJSON = obj2 as IObjectsGroupJSON;

    // check if children are the same
    return compareObjectsJSONArray(obj1Group.children, obj2Group.children);
  }

  throw new Error(`Object Type unknown: ${obj1.type}`);
}

export function compareObjectsJSONArray(
  array1: IObjectsCommonJSON[],
  array2: IObjectsCommonJSON[]
): boolean {
  // if different number of children, not equal
  if (array1.length !== array2.length) {
    return false;
  }

  // compare children one by one
  let equalChildren: boolean = true;
  for (let i: number = 0; i < array1.length; i += 1) {
    equalChildren = equalChildren && equalJSON(array1[i], array2[i]);
    if (!equalChildren) {
      return false;
    }
  }
  return equalChildren; // true
}

export function setMeshMaterial(
  mesh: THREE.Mesh | THREE.Group,
  material: object
): THREE.Mesh | THREE.Group {
  if (mesh instanceof THREE.Mesh) {
    if (mesh.material instanceof THREE.MeshLambertMaterial) {
      mesh.material.setValues(material);
    }
  } else if (mesh instanceof THREE.Group) {
    mesh.children.forEach(child =>
      setMeshMaterial(child as THREE.Mesh | THREE.Group, material)
    );
  }

  return mesh;
}

export class MeshOperations {
  public static applyMirrorOperation(
    mesh: THREE.Object3D,
    operation: IMirrorOperation
  ): THREE.Object3D {
    if (operation.plane === "xy") {
      MeshOperations.applyScaleOperation(
        mesh,
        Object3D.createScaleOperation(1, 1, -1)
      );
    } else if (operation.plane === "yz") {
      MeshOperations.applyScaleOperation(
        mesh,
        Object3D.createScaleOperation(-1, 1, 1)
      );
    } else if (operation.plane === "zx") {
      MeshOperations.applyScaleOperation(
        mesh,
        Object3D.createScaleOperation(1, -1, 1)
      );
    }
    return mesh;
  }

  public static applyTranslateOperation(
    mesh: THREE.Object3D,
    operation: ITranslateOperation
  ): THREE.Object3D {
    if (operation.relative) {
      mesh.translateX(operation.x);
      mesh.translateY(operation.y);
      mesh.translateZ(operation.z);
    } else {
      // absolute x,y,z axis.
      mesh.position.x += Number(operation.x);
      mesh.position.y += Number(operation.y);
      mesh.position.z += Number(operation.z);
    }
    return mesh;
  }

  public static applyRotateOperation(
    mesh: THREE.Object3D,
    operation: IRotateOperation
  ): THREE.Object3D {
    const x = THREE.Math.degToRad(Number(operation.x));
    const y = THREE.Math.degToRad(Number(operation.y));
    const z = THREE.Math.degToRad(Number(operation.z));
    if (operation.relative) {
      mesh.rotateX(x);
      mesh.rotateY(y);
      mesh.rotateZ(z);
    } else {
      mesh.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), x);
      mesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), y);
      mesh.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), z);
    }
    return mesh;
  }

  public static applyScaleOperation(
    mesh: THREE.Object3D,
    operation: IScaleOperation
  ): THREE.Object3D {
    mesh.scale.set(
      mesh.scale.x * Number(operation.x),
      mesh.scale.y * Number(operation.y),
      mesh.scale.z * Number(operation.z)
    );
    return mesh;
  }

  public static applyOperations(
    mesh: THREE.Object3D,
    operations: OperationsArray
  ): THREE.Object3D {
    operations.forEach(operation => {
      // Translate operation
      if (operation.type === ObjectsCommon.createTranslateOperation().type) {
        MeshOperations.applyTranslateOperation(
          mesh,
          operation as ITranslateOperation
        );
      } else if (
        operation.type === ObjectsCommon.createRotateOperation().type
      ) {
        MeshOperations.applyRotateOperation(
          mesh,
          operation as IRotateOperation
        );
      } else if (operation.type === ObjectsCommon.createScaleOperation().type) {
        MeshOperations.applyScaleOperation(mesh, operation as IScaleOperation);
      } else if (
        operation.type === ObjectsCommon.createMirrorOperation().type
      ) {
        MeshOperations.applyMirrorOperation(
          mesh,
          operation as IMirrorOperation
        );
      } else {
        throw Error("ERROR: Unknown Operation");
      }
    });
    mesh.updateMatrixWorld(true);
    mesh.updateMatrix();
    return mesh;
  }
}
