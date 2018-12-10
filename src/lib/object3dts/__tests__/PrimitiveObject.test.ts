import Cube, { ICubeJSON, ICubeParams } from '../Cube';
import ObjectsCommon, { OperationsArray, IViewOptions } from '../ObjectsCommon';
import * as THREE from 'three';
import PrimitiveObject from '../PrimitiveObject';

const width = 10;
const height = 15;
const depth = 20;

let objParams: ICubeParams = {
  width,
  height,
  depth,
};
let operations: OperationsArray = [];
let viewOptions: IViewOptions = ObjectsCommon.createViewOptions();

/// CONSTRUCTOR TESTS

test('PrimitiveObject - toJSON', () => {
  const json: ICubeJSON = {
    parameters: {
      width, height, depth,
    },
    operations: [],
    viewOptions: ObjectsCommon.createViewOptions(),
    id: "000",
    type: Cube.typeName,
  };

  const obj = new Cube(objParams, operations, viewOptions);
  json.id = obj.toJSON().id;
  expect(json).toEqual(obj.toJSON());

  (obj as any).operations = [ObjectsCommon.createTranslateOperation(10,20,30)];
  json.operations = [ObjectsCommon.createTranslateOperation(10,20,30)];
  json.operations[0].id = obj.toJSON().operations[0].id;

  expect(json).toEqual(obj.toJSON());

  (obj as any).operations = [ObjectsCommon.createTranslateOperation(10,20,30), ObjectsCommon.createTranslateOperation(10,20,30)];
  json.operations = [ObjectsCommon.createTranslateOperation(10,20,30), ObjectsCommon.createTranslateOperation(10,20,30)];
  json.operations[0].id = obj.toJSON().operations[0].id;
  json.operations[1].id = obj.toJSON().operations[1].id;

  expect(json).toEqual(obj.toJSON());

  (obj as any).parameters = {width: 10, height:20, depth: 30};
  json.parameters = {width: 10, height:20, depth: 30};
  
  expect(json).toEqual(obj.toJSON());

});
