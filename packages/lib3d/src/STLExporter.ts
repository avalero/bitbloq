/*
 * File: STLExporter.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Copyright 2018 - 2019 BQ Educacion.
 * -----
 * File Created: Thursday, 28th February 2019
 * Last Modified:: Thursday, 28th February 2019 3:25:47 pm
 * -----
 * Author: David García (david.garciaparedes@bq.com)
 * Author: Alda Martín (alda.marting@bq.com)
 * Author: Alberto Valero (alberto.valero@bq.com)
 * -----
 *
 * Derived from STLExporter.js from
 * @author kovacsv / http://kovacsv.hu/
 * @author mrdoob / http://mrdoob.com/
 * @author mudcube / http://mudcu.be/
 * @author Mugen87 / https://github.com/Mugen87
 */

import JSZip from "jszip";
import * as THREE from "three";
import { saveAs } from "file-saver";

export default async function meshArray2STLAsync(
  meshes: THREE.Mesh[],
  name: string = ""
): Promise<void> {
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
        matrixWorld: mesh.matrixWorld
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

  const zip = new JSZip();

  stlData.forEach((data: any, i: number) => {
    const blob = new Blob([data], { type: "application/octet-stream" });
    zip.file(`${stlNames[i]}.stl`, blob);
    // saveAs(blob, `${stlNames[i]}.stl`);
  });

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "scene.zip");
}
