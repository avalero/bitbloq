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

test('PrimitiveObject - UpdateFromJSON', async () => {
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
  const spy = jest.spyOn(obj, 'computeMeshAsync');
  json.id = obj.toJSON().id;
  expect(json).toEqual(obj.toJSON());

  json.operations = [ObjectsCommon.createTranslateOperation(10,20,30)];
  obj.updateFromJSON(json);
  expect(json).toEqual(obj.toJSON());
  expect(spy).toBeCalledTimes(1);



  json.operations = [ObjectsCommon.createTranslateOperation(10,20,30), ObjectsCommon.createTranslateOperation(10,20,30)];
  obj.updateFromJSON(json);
  expect(json).toEqual(obj.toJSON());
  expect(spy).toBeCalledTimes(2);


  json.parameters = {width: 10, height:20, depth: 30};
  obj.updateFromJSON(json);
  expect(spy).toBeCalledTimes(3);
  expect(json).toEqual(obj.toJSON());

  // no changes, so computeMeshAsync should not be recalled
  obj.updateFromJSON(json);
  expect(spy).toBeCalledTimes(3);

  //already computed, so computeMeshAsync should not be recalled
  await obj.getMeshAsync();
  expect(spy).toBeCalledTimes(3);
})