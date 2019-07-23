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

  const getBooleanFromBSP = (
    bspNodes: ThreeCSG.BSPNode[],
    operation: (bspNodes: BSPNode[]) => BSPNode
  ): THREE.Geometry => {
    try {
      const t0 = performance.now();
      console.log(`start ${bspNodes.length} nodes`);
      const bspResult: BSPNode = operation(bspNodes);
      console.log('End');
      console.log(`${performance.now() - t0} ms`);
      return bspResult.toGeometry();
    } catch (e) {
      console.log(`Error: ${e}`);
      throw e;
    }
  };

  ctx.addEventListener(
    'message',
    e => {
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
        geometry = getBooleanFromBSP(bspNodes, ThreeCSG.boolean.unionArray);
      } else if (e.data.type === 'Difference') {
        geometry = getBooleanFromBSP(bspNodes, ThreeCSG.boolean.sutractArray);
      } else if (e.data.type === 'Intersection') {
        geometry = getBooleanFromBSP(
          bspNodes,
          ThreeCSG.boolean.intersectionArray
        );
      } else {
        const postMessage = {
          status: 'error',
        };
        ctx.postMessage(postMessage);
      }

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
