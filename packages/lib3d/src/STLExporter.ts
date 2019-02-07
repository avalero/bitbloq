/**
 * @author Alberto Valero <alberto.valero@bq.com>
 *
 * Derived from STLExporter.js from
 * @author kovacsv / http://kovacsv.hu/
 * @author mrdoob / http://mrdoob.com/
 * @author mudcube / http://mudcu.be/
 * @author Mugen87 / https://github.com/Mugen87
 *
 *
 */

import * as THREE from 'three';
import { saveAs } from 'file-saver';

export default function meshArray2STL(
  meshes: THREE.Mesh[],
  name: string = '',
): void {
  const vector = new THREE.Vector3();
  const normalMatrixWorld = new THREE.Matrix3();
  const stlData: any = [];
  const stlNames: string[] = [];

  meshes.forEach(threeObj => {
    let object: {
      geometry: THREE.Geometry;
      matrixWorld: THREE.Matrix4;
    };
    let triangles;

    if (threeObj instanceof THREE.Mesh) {
      const mesh = threeObj;
      stlNames.push(`${name}${mesh.userData.viewOptions.name}`);
      let geometry: THREE.Geometry | THREE.BufferGeometry = mesh.geometry;

      if (geometry instanceof THREE.BufferGeometry) {
        geometry = new THREE.Geometry().fromBufferGeometry(geometry);
      }

      triangles = geometry.faces.length;
      object = {
        geometry,
        matrixWorld: mesh.matrixWorld,
      };

      let offset = 80; // skip header
      const bufferLength = triangles * 2 + triangles * 3 * 4 * 4 + 80 + 4;
      const arrayBuffer = new ArrayBuffer(bufferLength);
      const output = new DataView(arrayBuffer);
      output.setUint32(offset, triangles, true);
      offset += 4;

      const vertices = object.geometry.vertices;
      const faces = object.geometry.faces;
      const matrixWorld = object.matrixWorld;

      normalMatrixWorld.getNormalMatrix(matrixWorld);

      for (let j = 0, jl = faces.length; j < jl; j += 1) {
        const face = faces[j];

        vector
          .copy(face.normal)
          .applyMatrix3(normalMatrixWorld)
          .normalize();

        output.setFloat32(offset, vector.x, true);
        offset += 4; // normal
        output.setFloat32(offset, vector.y, true);
        offset += 4;
        output.setFloat32(offset, vector.z, true);
        offset += 4;

        const indices = [face.a, face.b, face.c];

        for (let k = 0; k < 3; k += 1) {
          vector.copy(vertices[indices[k]]).applyMatrix4(matrixWorld);

          output.setFloat32(offset, vector.x, true);
          offset += 4; // vertices
          output.setFloat32(offset, vector.y, true);
          offset += 4;
          output.setFloat32(offset, vector.z, true);
          offset += 4;
        }

        output.setUint16(offset, 0, true);
        offset += 2; // attribute byte count
      }
      stlData.push(output);
    }
  });

  stlData.forEach((data: any, i: number) => {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    saveAs(blob, `${stlNames[i]}.stl`);
  });
}
