/**
 * Copyright (c) 2018 Bitbloq (BQ)
 *
 * License: MIT
 *
 * long description for the file
 *
 * @summary short description for the file
 * @author David García <https://github.com/empoalp>
 * @author Alberto Valero <https://github.com/avalero>
 *
 * Created at     : 2018-10-23 11:14:39
 * Last modified  : 2018-10-24 20:39:39
 */

// workerfile.js

import * as THREE from 'three';
import {ThreeBSP} from './threeCSG';

const ctx: Worker = self as any;

const getUnionFromGeometries = (geometries:Array<THREE.Geometry>) : THREE.Geometry => {
  let unionGeomBSP:any = new ThreeBSP(geometries[0]);  
  // Union with the rest
  for (let i = 1; i < geometries.length; i += 1) {
    const bspGeom = new ThreeBSP(geometries[i]);
    unionGeomBSP = unionGeomBSP.union(bspGeom);
  }

  return unionGeomBSP.toGeometry();
}

ctx.addEventListener(
  'message',
  (e) => {

    const geometries:Array<THREE.Geometry> = [];

    const bufferArray = e.data.bufferArray;

    //add all children to geometries array
    for (let i=0; i < bufferArray.length; i += 2){
      //recompute object form vertices and normals
      const verticesBuffer: ArrayBuffer = e.data.bufferArray[i];
      const normalsBuffer: ArrayBuffer = e.data.bufferArray[i+1];
      const _vertices: ArrayLike<number> = new Float32Array(verticesBuffer, 0, verticesBuffer.byteLength / Float32Array.BYTES_PER_ELEMENT);
      const _normals: ArrayLike<number> = new Float32Array(normalsBuffer, 0, normalsBuffer.byteLength / Float32Array.BYTES_PER_ELEMENT);
      const buffGeometry = new THREE.BufferGeometry();
      buffGeometry.addAttribute( 'position', new THREE.BufferAttribute( _vertices, 3 ) );
      buffGeometry.addAttribute( 'normal', new THREE.BufferAttribute( _normals, 3 ) );
      const geometry:THREE.Geometry = new THREE.Geometry().fromBufferGeometry(buffGeometry); // ERROR HERE?
      geometries.push(geometry);
    }

    //compute union

    const unionGeometry:THREE.Geometry = getUnionFromGeometries(geometries);

    // get buffer data
    const bufferGeom: THREE.BufferGeometry = new THREE.BufferGeometry().fromGeometry(unionGeometry);
    const vertices = new Float32Array(bufferGeom.getAttribute('position').array);
    const normals = new Float32Array(bufferGeom.getAttribute('normal').array);

    const message = {
      status: 'complete',
      vertices,
      normals,
    };
    
    ctx.postMessage(message, [message.vertices.buffer, message.normals.buffer]);
  },

  false,
);
