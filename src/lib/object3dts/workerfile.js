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
 * Last modified  : 2018-10-24 13:28:22
 */

// workerfile.js

import * as THREE from 'three';
import Cube from './Cube.ts';


self.addEventListener(
  'message',
  (e) => {
    const cube = new Cube({ width: 10, height: 10, depth: 10 });
    const geom = cube.getMesh().geometry;
    const bufferGeom = new THREE.BufferGeometry().fromGeometry(geom);

    const vertices = new Float32Array(bufferGeom.getAttribute('position').array).buffer;
    const normals = new Float32Array(bufferGeom.getAttribute('position').array).buffer;

    const message = {
      status: 'complete',
      vertices,
      normals,
    };

    self.postMessage(message, [message.vertices, message.normals]);
  },
  false,
);
