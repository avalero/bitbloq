/**
 * License: MIT
 *
 * long description for the file
 *
 * @summary short description for the file
 * @author Alberto Valero <https://github.com/avalero>
 *
 * Created at     : 2019-01-18 19:13:38
 * Last modified  : 2019-01-18 20:00:14
 */

import * as THREE from 'three';
import ThreeBSP from './threeCSG';
import * as ThreeCSG from './threecsg/index';
import BSPNode from './threecsg/BSPNode';

// import demo from './demo.js';
// import demoModule from './demo.wasm';

// const module = demo({
//   locateFile(path) {
//     if (path.endsWith('.wasm')) {
//       return demoModule;
//     }
//     return path;
//   },
// });

export default Worker;

// Be sure we are not withing a node execution
if (!(typeof module !== 'undefined' && module.exports)) {
  const ctx: Worker = self as any;

  const getUnionFromBSP = (bspNodes: ThreeCSG.BSPNode[]): THREE.Geometry => {
    const t0 = performance.now();
    console.log(`start ${bspNodes.length} nodes`);
    const bspResult: BSPNode = ThreeCSG.boolean.unionArray(bspNodes);
    console.log('End');
    console.log(`${performance.now() - t0} ms`);
    return bspResult.toGeometry();
  };

  const getDifferenceFromBSP = (
    bspNodes: ThreeCSG.BSPNode[]
  ): THREE.Geometry => {
    try {
      console.log(`start ${bspNodes.length} nodes`);
      let bspResult: ThreeCSG.BSPNode = bspNodes[0];
      let differenceBSP: ThreeCSG.BSPNode = bspNodes[1];
      for (let i = 2; i < bspNodes.length; i += 1) {
        console.log(i);
        differenceBSP = ThreeCSG.boolean.union(differenceBSP, bspNodes[i]);
      }
      bspResult = ThreeCSG.boolean.subtract(bspResult, differenceBSP);
    } catch (e) {
      console.log(`Error: ${e}`);
    }
    return bspResult.toGeometry();
  };

  const getIntersectionFromBSP = (
    bspNodes: ThreeCSG.BSPNode[]
  ): THREE.Geometry => {
    console.log(`start ${bspNodes.length} nodes`);
    let bspResult: ThreeCSG.BSPNode = bspNodes[0];
    for (let i = 1; i < bspNodes.length; i += 1) {
      console.log(i);
      bspResult = ThreeCSG.boolean.intersect(bspResult, bspNodes[i]);
    }

    return bspResult.toGeometry();
  };

  ctx.addEventListener(
    'message',
    e => {
      // const geometries: THREE.Geometry[] = [];
      // const bufferArray = e.data.bufferArray;

      // if (!bufferArray) return;

      // let firstGeomMatrix: THREE.Matrix4 | undefined;

      // // add all children to geometries array
      // for (let i = 0; i < bufferArray.length; i += 3) {
      //   // recompute object form vertices and normals
      //   const verticesBuffer: ArrayBuffer = e.data.bufferArray[i];
      //   const normalsBuffer: ArrayBuffer = e.data.bufferArray[i + 1];
      //   const positionBuffer: ArrayBuffer = e.data.bufferArray[i + 2];
      //   const _vertices: ArrayLike<number> = new Float32Array(
      //     verticesBuffer,
      //     0,
      //     verticesBuffer.byteLength / Float32Array.BYTES_PER_ELEMENT
      //   );
      //   const _normals: ArrayLike<number> = new Float32Array(
      //     normalsBuffer,
      //     0,
      //     normalsBuffer.byteLength / Float32Array.BYTES_PER_ELEMENT
      //   );
      //   const _positions: ArrayLike<number> = new Float32Array(
      //     positionBuffer,
      //     0,
      //     positionBuffer.byteLength / Float32Array.BYTES_PER_ELEMENT
      //   );
      //   const matrixWorld: THREE.Matrix4 = new THREE.Matrix4();
      //   matrixWorld.elements = new Float32Array(_positions);
      //   if (i === 0) {
      //     firstGeomMatrix = matrixWorld.clone();
      //   }
      //   const buffGeometry = new THREE.BufferGeometry();
      //   buffGeometry.addAttribute(
      //     'position',
      //     new THREE.BufferAttribute(_vertices, 3)
      //   );
      //   buffGeometry.addAttribute(
      //     'normal',
      //     new THREE.BufferAttribute(_normals, 3)
      //   );
      //   const objectGeometry: THREE.Geometry = new THREE.Geometry().fromBufferGeometry(
      //     buffGeometry
      //   );
      //   objectGeometry.applyMatrix(matrixWorld);
      //   geometries.push(objectGeometry);
      // }

      const bspNodes: ThreeCSG.BSPNode[] = [];
      const bspNodesBuffer: ArrayBuffer[] = e.data.bufferArray;
      if (!bspNodesBuffer) return;

      for (const bspNodeBuffer of bspNodesBuffer) {
        const node = new ThreeCSG.BSPNode();
        node.fromArrayBuffer(bspNodeBuffer);
        bspNodes.push(node);
      }

      // compute action
      let geometry: THREE.Geometry = new THREE.Geometry();
      if (e.data.type === 'Union') {
        geometry = getUnionFromBSP(bspNodes);
      } else if (e.data.type === 'Difference') {
        geometry = getDifferenceFromBSP(bspNodes);
      } else if (e.data.type === 'Intersection') {
        geometry = getIntersectionFromBSP(bspNodes);
      } else {
        const postMessage = {
          status: 'error',
        };
        ctx.postMessage(postMessage);
      }

      // move resulting geometry to origin of coordinates (center on first child on origin)
      // const invMatrix: THREE.Matrix4 = new THREE.Matrix4();
      // if (firstGeomMatrix) {
      //   invMatrix.getInverse(firstGeomMatrix);
      // }
      // geometry.applyMatrix(invMatrix);

      // get buffer data
      const bufferGeom: THREE.BufferGeometry = new THREE.BufferGeometry().fromGeometry(
        geometry
      );
      const vertices = new Float32Array(
        bufferGeom.getAttribute('position').array
      );
      const normals = new Float32Array(bufferGeom.getAttribute('normal').array);

      const message = {
        vertices,
        normals,
        status: 'ok',
      };

      ctx.postMessage(message, [
        message.vertices.buffer,
        message.normals.buffer,
      ]);
    },

    false
  );
}
