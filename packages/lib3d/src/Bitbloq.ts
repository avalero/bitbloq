/*
 * File: Bitbloq.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Copyright 2018 - 2019 BQ Educacion.
 * -----
 * File Created: Monday, 25th February 2019
 * Last Modified:: Monday, 25th February 2019 7:04:57 pm
 * -----
 * Author: David García (david.garciaparedes@bq.com)
 * Author: Alda Martín (alda.marting@bq.com)
 * Author: Alberto Valero (alberto.valero@bq.com)
 * -----
 */

import { isEqual } from 'lodash';
import {
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
} from './Interfaces';

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
    'Cube',
    'Cylinder',
    'Sphere',
    'Prism',
    'TextObject',
    'Pyramid',
    'Cone',
    'TruncatedCone',
    'SemiCylinder',
    'Torus',
    'RectPrism',
    'Star',
    'Heart',
    'Tube',
  ];

  const compoundObjectTypes: string[] = ['Union', 'Difference', 'Intersection'];

  const stlType = 'STLObject';
  const predesignedType = 'PredesignedObject';

  const obj1Basics = {
    id: obj1.id,
    operations: obj1.operations,
    type: obj1.type,
  };

  const obj2Basics = {
    id: obj2.id,
    operations: obj2.operations,
    type: obj2.type,
  };

  // check common parameters
  if (!isEqual(obj1Basics, obj2Basics)) return false;
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
  if (obj1.type === 'RepetitionObject') {
    const obj1Rep = obj1 as IRepetitionObjectJSON;
    const obj2Rep = obj2 as IRepetitionObjectJSON;

    // compare params
    if (!isEqual(obj1Rep.parameters, obj2Rep.parameters)) return false;

    // compare repeated object (children[0])
    return equalJSON(obj1Rep.children[0], obj2Rep.children[0]);
  }

  // Group

  if (obj1.type === 'ObjectsGroup') {
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
  if (array1.length !== array2.length) return false;

  // compare children one by one
  let equalChildren: boolean = true;
  for (let i: number = 0; i < array1.length; i += 1) {
    equalChildren = equalChildren && equalJSON(array1[i], array2[i]);
    if (!equalChildren) return false;
  }
  return equalChildren; // true
}

// import Cube from './Cube';
// import Cylinder from './Cylinder';
// import Sphere from './Sphere';
// import Prism from './Prism';
// import TextObject from './TextObject';
// import Pyramid from './Pyramid';
// import STLObject from './STLObject';
// import Union from './Union';
// import Difference from './Difference';
// import RepetitionObject from './RepetitionObject';
// import ObjectsGroup from './ObjectsGroup';
