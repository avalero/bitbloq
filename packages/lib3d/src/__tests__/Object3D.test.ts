import "jsdom-worker";
interface Global {
  fetch: any;
}
const global: Global = { fetch: undefined };
global.fetch = require("jest-fetch-mock");

import Cube from "../Cube";
import * as THREE from "three";

import { IGeometry } from "../Interfaces";
import Union from "../Union";

test("Scene - getGeometries - vertices and normals", async () => {
  const cube = new Cube({ width: 10, height: 10, depth: 10 });
  const mesh = (await cube.getMeshAsync()) as THREE.Mesh;
  const vertices = [10, 20, 30];
  const normals = [40, 50, 60];
  mesh.userData.vertices = vertices;
  mesh.userData.normals = normals;

  const cube2 = new Cube({ width: 10, height: 10, depth: 10 }, [], {}, mesh);

  const geometry: IGeometry = cube.getGeometryData();
  const geometry2: IGeometry = cube2.getGeometryData();

  expect(geometry.id).toEqual(cube.getID());
  expect(geometry.vertices).toBeUndefined();
  expect(geometry.normals).toBeUndefined();

  expect(geometry2.id).toEqual(cube2.getID());
  expect(geometry2.vertices).toBe(vertices);
  expect(geometry2.normals).toBe(normals);
});
