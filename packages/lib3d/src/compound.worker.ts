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

import wasm from './wasmcsg.js';
import wasmModule from './wasmcsg.wasm';

const module = wasm({
  locateFile(path) {
    if (path.endsWith('.wasm')) {
      return wasmModule;
    }
    return path;
  },
});

const wasmReadyPromise: Promise<void> = new Promise((resolve, reject) => {
  module.onRuntimeInitialized = () => {
    resolve();
  };
});

const concatArrayBuffers = (...buffers: ArrayBuffer[]): ArrayLike<number> => {
  const buffersLengths: number[] = buffers.map(
    b => b.byteLength / Float32Array.BYTES_PER_ELEMENT
  );
  const totalBufferlength: number = buffersLengths.reduce((p, c) => p + c, 0);
  const f32Array: Float32Array = new Float32Array(totalBufferlength);
  buffersLengths.reduce((p, c, i) => {
    f32Array.set(new Float32Array(buffers[i]), p);
    return p + c;
  }, 0);

  return f32Array;
};

export default Worker;

// Be sure we are not withing a node execution
if (!(typeof module !== 'undefined' && module.exports)) {
  const ctx: Worker = self as any;

  const getUnionFromGeometries = (
    geometries: THREE.Geometry[]
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
    geometries: THREE.Geometry[]
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
    geometries: THREE.Geometry[]
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
    'message',
    e => {
      // WASM START!!!
      console.log('received event');

      wasmReadyPromise.then(() => {
        console.log('WASM Module initialized. Start!!');
        module.clean();

        const geometries: THREE.Geometry[] = [];
        const bufferArray = e.data.bufferArray;

        if (!bufferArray) return;

        let firstGeomMatrix: THREE.Matrix4 | undefined;

        // add all children to geometries array
        for (let i = 0; i < bufferArray.length; i += 3) {
          let _wasmBuffer: any;
          try {
            // recompute object form vertices and normals
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

            const _position: ArrayLike<number> = new Float32Array(
              positionBuffer,
              0,
              positionBuffer.byteLength / Float32Array.BYTES_PER_ELEMENT
            );

            ////////////////////////////////////////////////////////
            // WASM  ///////////////////////////////////////////////
            ////////////////////////////////////////////////////////

            const _wasmData: ArrayLike<number> = concatArrayBuffers(
              verticesBuffer,
              normalsBuffer,
              positionBuffer
            );

            _wasmBuffer = module._malloc(
              (_vertices.length * verticesBuffer.byteLength) /
                Float32Array.BYTES_PER_ELEMENT +
                (_normals.length * normalsBuffer.byteLength) /
                  Float32Array.BYTES_PER_ELEMENT +
                (_position.length * positionBuffer.byteLength) /
                  Float32Array.BYTES_PER_ELEMENT
            );

            // tslint:disable-next-line:no-bitwise
            module.HEAPF32.set(_wasmData, _wasmBuffer >> 2);

            console.log("Add Geometry");
            module._addGeometry(
              _wasmBuffer,
              _vertices.length,
              _normals.length,
              _position.length
            );
            console.log("Geometry Added");

            console.log('free buffer');
            module._free(_wasmBuffer); /// WASM!!!!

            ////////////////////////////////////////////////////////
            // END WASM  ///////////////////////////////////////////
            ////////////////////////////////////////////////////////

            /*
            const matrixWorld: THREE.Matrix4 = new THREE.Matrix4();
            matrixWorld.elements = new Float32Array(_position);
            if (i === 0) {
              firstGeomMatrix = matrixWorld.clone();
            }

            const buffGeometry = new THREE.BufferGeometry();
            buffGeometry.addAttribute(
              'position',
              new THREE.BufferAttribute(_vertices, 3)
            );
            buffGeometry.addAttribute(
              'normal',
              new THREE.BufferAttribute(_normals, 3)
            );
            const objectGeometry: THREE.Geometry = new THREE.Geometry().fromBufferGeometry(
              buffGeometry
            );
            objectGeometry.applyMatrix(matrixWorld);
            geometries.push(objectGeometry);
            */
          } catch (e) {
            console.log(e);
          } finally {
            console.log('Done!');
          }
        }

        ////////////////////// WASM //////////////////////

        console.log('Geom to Buffer');
        try {
          // module.computeUnion();
          module.bspToBuffer(0);
          const verticesSize = module.getVerticesSize();
          const normalsSize = module.getNormalsSize();

          console.log(`Vertices size: ${verticesSize}`);
          console.log(`Normals size: ${normalsSize}`);
          const verticesResult: any = module._getVerticesBuffer();
          const normalsResult: any = module._getNormalsBuffer();

          const verticesData: number[] = [];
          const normalsData: number[] = [];

          for (let v = 0; v < verticesSize; v += 1) {
            verticesData.push(
              module.HEAPF32[
                verticesResult / Float32Array.BYTES_PER_ELEMENT + v
              ]
            );
          }

          for (let v = 0; v < normalsSize; v += 1) {
            normalsData.push(
              module.HEAPF32[normalsResult / Float32Array.BYTES_PER_ELEMENT + v]
            );
          }

          module.clean();

          const message = {
            verticesData: new Float32Array(verticesData),
            normalsData: new Float32Array(normalsData),
            status: 'ok',
          };

          console.log("Send message back from webworker");
          ctx.postMessage(message, [
            message.verticesData.buffer,
            message.normalsData.buffer,
          ]);
        } catch (e) {
          console.log(e);
        }

        ///////////////// END WASM ///////////////////

        /*
        // compute action
        let geometry: THREE.Geometry = new THREE.Geometry();
        if (e.data.type === 'Union') {
          geometry = getUnionFromGeometries(geometries);
        } else if (e.data.type === 'Difference') {
          geometry = getDifferenceFromGeometries(geometries);
        } else if (e.data.type === 'Intersection') {
          geometry = getIntersectionFromGeometries(geometries);
        } else {
          const postMessage = {
            status: 'error',
          };
          ctx.postMessage(postMessage);
        }

        // move resulting geometry to origin of coordinates (center on first child on origin)
        const invMatrix: THREE.Matrix4 = new THREE.Matrix4();
        if (firstGeomMatrix) {
          invMatrix.getInverse(firstGeomMatrix);
        }
        geometry.applyMatrix(invMatrix);

        // get buffer data
        const bufferGeom: THREE.BufferGeometry = new THREE.BufferGeometry().fromGeometry(
          geometry
        );
        const vertices = new Float32Array(
          bufferGeom.getAttribute('position').array
        );
        const normals = new Float32Array(
          bufferGeom.getAttribute('normal').array
        );

        const message = {
          vertices,
          normals,
          status: 'ok',
        };

        ctx.postMessage(message, [
          message.vertices.buffer,
          message.normals.buffer,
        ]);
        */
      });
    },

    false
  );
}
