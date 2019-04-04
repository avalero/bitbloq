/**
 * Copyright (c) 2018 Bitbloq (BQ)
 *
 * @license MIT
 *
 * Derived from https://gist.github.com/bellbind/477817982584ac8473ef/
 * by bellbind <https://gist.github.com/bellbind>
 *
 * STLLoader Class (loads binary and ascii STL files)
 *
 * @summary STLLoader Class (loads binary and ascii STL files)
 * @author Bellbind <https://github.com/bellbind>
 * @author David García <https://github.com/empoalp>
 * @author Alberto Valero <https://github.com/avalero>
 *
 * Created at     : 2018-09-14 10:46:49
 * Last modified  : 2019-01-09 17:18:39
 */

import * as THREE from "three";

export default class STLLoader {
  public static binaryVector3(view: any, offset: number) {
    const v: THREE.Vector3 = new THREE.Vector3();
    v.x = view.getFloat32(offset + 0, true);
    v.y = view.getFloat32(offset + 4, true);
    v.z = view.getFloat32(offset + 8, true);
    return v;
  }

  public static m2vec3(match: any) {
    const v: THREE.Vector3 = new THREE.Vector3();
    v.x = parseFloat(match[1]);
    v.y = parseFloat(match[2]);
    v.z = parseFloat(match[3]);
    return v;
  }

  public static toLines(array: any) {
    const lines: string[] = [];
    let h: number = 0;
    for (let i: number = 0; i < array.length; i += 1) {
      if (array[i] === 10) {
        const line: string = String.fromCharCode.apply(
          null,
          array.subarray(h, i)
        );
        lines.push(line);
        h = i + 1;
      }
    }
    lines.push(String.fromCharCode.apply(null, array.subarray(h)));
    return lines;
  }

  public static loadBinaryStl(buffer: any) {
    // binary STL
    const view = new DataView(buffer);
    const size = view.getUint32(80, true);
    const geom = new THREE.Geometry();
    let offset: number = 84;
    for (let i: number = 0; i < size; i += 1) {
      const normal = STLLoader.binaryVector3(view, offset);
      geom.vertices.push(STLLoader.binaryVector3(view, offset + 12));
      geom.vertices.push(STLLoader.binaryVector3(view, offset + 24));
      geom.vertices.push(STLLoader.binaryVector3(view, offset + 36));
      geom.faces.push(new THREE.Face3(i * 3, i * 3 + 1, i * 3 + 2, normal));
      offset += 4 * 3 * 4 + 2;
    }
    return geom;
  }

  public static loadTextStl(buffer: any) {
    const lines = STLLoader.toLines(new Uint8Array(buffer));
    let index: number = 0;

    const scan = (regexp: RegExp) => {
      while (lines[index].match(/^\s*$/)) {
        index += 1;
      }
      const r = lines[index].match(regexp);
      return r;
    };

    const scanOk = (regexp: RegExp) => {
      const r = scan(regexp);
      if (!r) {
        throw new Error(
          `not text stl: ${regexp.toString()} => (line ${index - 1}) [${
            lines[index - 1]
          }]`
        );
      }

      index += 1;
      return r;
    };

    const facetReg = /^\s*facet\s+normal\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)/;
    const vertexReg = /^\s*vertex\s+([^s]+)\s+([^\s]+)\s+([^\s]+)/;
    const geom = new THREE.Geometry();
    scanOk(/^\s*solid\s(.*)/);
    while (!scan(/^\s*endsolid/)) {
      const normal = scanOk(facetReg);
      scanOk(/^\s*outer\s+loop/);
      const v1 = scanOk(vertexReg);
      const v2 = scanOk(vertexReg);
      const v3 = scanOk(vertexReg);
      scanOk(/\s*endloop/);
      scanOk(/\s*endfacet/);
      const base = geom.vertices.length;
      geom.vertices.push(STLLoader.m2vec3(v1));
      geom.vertices.push(STLLoader.m2vec3(v2));
      geom.vertices.push(STLLoader.m2vec3(v3));
      geom.faces.push(
        new THREE.Face3(base, base + 1, base + 2, STLLoader.m2vec3(normal))
      );
    }
    return geom;
  }
}
