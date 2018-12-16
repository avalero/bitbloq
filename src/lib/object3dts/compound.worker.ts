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
 * Created at     : 2018-11-09 09:29:49
 * Last modified  : 2018-11-28 18:11:22
 */

import * as THREE from "three";
import ThreeBSP from "./threeCSG";
import "./custom.d";

const ctx: CompoundWorker = self as any;

export default class CompoundWorker extends Worker {
  constructor() {
    super("http://bitbloq.bq.com");
  }
}

const getUnionFromGeometries = (
  geometries: Array<THREE.Geometry>
): THREE.Geometry => {
  let geomBSP: any = new ThreeBSP(geometries[0]);
  // Union with the rest
  for (let i = 1; i < geometries.length; i += 1) {
    const bspGeom = new ThreeBSP(geometries[i]);
    geomBSP = geomBSP.union(bspGeom);
  }
  const geom = geomBSP.toGeometry();
  return geom;
};

const getDifferenceFromGeometries = (
  geometries: Array<THREE.Geometry>
): THREE.Geometry => {
  let geomBSP: any = new ThreeBSP(geometries[0]);
  // Union with the rest
  for (let i = 1; i < geometries.length; i += 1) {
    const bspGeom = new ThreeBSP(geometries[i]);
    geomBSP = geomBSP.subtract(bspGeom);
  }
  const geom = geomBSP.toGeometry();
  return geom;
};

const getIntersectionFromGeometries = (
  geometries: Array<THREE.Geometry>
): THREE.Geometry => {
  let geomBSP: any = new ThreeBSP(geometries[0]);
  // Union with the rest
  for (let i = 1; i < geometries.length; i += 1) {
    const bspGeom = new ThreeBSP(geometries[i]);
    geomBSP = geomBSP.intersect(bspGeom);
  }
  const geom = geomBSP.toGeometry();
  return geom;
};

ctx.addEventListener(
  "message",
  e => {
    const geometries: Array<THREE.Geometry> = [];
    const bufferArray = e.data.bufferArray;

    let firstGeomMatrix: THREE.Matrix4 | undefined = undefined;

    //add all children to geometries array
    for (let i = 0; i < bufferArray.length; i += 3) {
      //recompute object form vertices and normals
      const verticesBuffer: ArrayBuffer = e.data.bufferArray[i];
      const normalsBuffer: ArrayBuffer = e.data.bufferArray[i + 1];
      const positionBuffer: ArrayBuffer = e.data.bufferArray[i + 2];
      const _vertices: ArrayLike<number> = new Float32Array(
        verticesBuffer,
        0,
        verticesBuffer.byteLength / Float32Array.BYTES_PER_ELEMENT
      );
      const _normals: ArrayLike<number> = new Float32Array(
        normalsBuffer,
        0,
        normalsBuffer.byteLength / Float32Array.BYTES_PER_ELEMENT
      );
      const _positions: ArrayLike<number> = new Float32Array(
        positionBuffer,
        0,
        positionBuffer.byteLength / Float32Array.BYTES_PER_ELEMENT
      );
      const matrixWorld: THREE.Matrix4 = new THREE.Matrix4();
      matrixWorld.elements = new Float32Array(_positions);
      if (i == 0) firstGeomMatrix = matrixWorld.clone();
      const buffGeometry = new THREE.BufferGeometry();
      buffGeometry.addAttribute(
        "position",
        new THREE.BufferAttribute(_vertices, 3)
      );
      buffGeometry.addAttribute(
        "normal",
        new THREE.BufferAttribute(_normals, 3)
      );
      const geometry: THREE.Geometry = new THREE.Geometry().fromBufferGeometry(
        buffGeometry
      );
      geometry.applyMatrix(matrixWorld);
      geometries.push(geometry);
    }

    //compute action
    let geometry: THREE.Geometry = new THREE.Geometry();
    if (e.data.type === "Union") {
      geometry = getUnionFromGeometries(geometries);
    } else if (e.data.type === "Difference") {
      geometry = getDifferenceFromGeometries(geometries);
    } else if (e.data.type === "Intersection") {
      geometry = getIntersectionFromGeometries(geometries);
    } else {
      const message = {
        status: "error"
      };
      ctx.postMessage(message);
    }

    //move resulting geometry to origin of coordinates (center on first child on origin)
    const invMatrix: THREE.Matrix4 = new THREE.Matrix4();
    if (firstGeomMatrix) invMatrix.getInverse(firstGeomMatrix);
    geometry.applyMatrix(invMatrix);

    // get buffer data
    const bufferGeom: THREE.BufferGeometry = new THREE.BufferGeometry().fromGeometry(
      geometry
    );
    const vertices = new Float32Array(
      bufferGeom.getAttribute("position").array
    );
    const normals = new Float32Array(bufferGeom.getAttribute("normal").array);

    const message = {
      status: "ok",
      vertices,
      normals
    };

    ctx.postMessage(message, [message.vertices.buffer, message.normals.buffer]);
  },

  false
);
