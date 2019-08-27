/**
 * Copyright (c) 2018 Bitbloq (BQ)
 *
 * License: MIT
 *
 * long description for the file
 *
 * Derived from THREE.GridHelper
 *
 * @summary short description for the file
 * @author David García <https://github.com/empoalp>, Alberto Valero <https://github.com/avalero>
 *
 * Created at     : 2018-11-06 10:52:42
 * Last modified  : 2019-01-18 19:00:19
 */

import { cloneDeep } from "lodash";
import * as THREE from "three";

export interface IGridConfig {
  size: number;
  smallGrid: {
    enabled: boolean;
    step: number;
    color: number;
    lineWidth: number;
  };
  bigGrid: {
    enabled: boolean;
    step: number;
    color: number;
    lineWidth: number;
  };
  centerGrid: {
    enabled: boolean;
    color: number;
    lineWidth: number;
  };
  plane: {
    enabled: boolean;
    color: number;
  };
}

export default class BaseGrid {
  private mesh: THREE.Group;
  private colorBig: THREE.Color;
  private colorSmall: THREE.Color;
  private colorCenter: THREE.Color;
  private gridConfig: IGridConfig;

  constructor(config: IGridConfig) {
    this.mesh = new THREE.Group();
    this.gridConfig = cloneDeep(config);
    this.colorBig = new THREE.Color(this.gridConfig.bigGrid.color);
    this.colorSmall = new THREE.Color(this.gridConfig.smallGrid.color);
    this.colorCenter = new THREE.Color(this.gridConfig.centerGrid.color);

    if (this.gridConfig.smallGrid.enabled) {
      this.mesh.add(this.smallGrid());
    }
    if (this.gridConfig.bigGrid.enabled) {
      this.mesh.add(this.bigGrid());
    }
    if (this.gridConfig.centerGrid.enabled) {
      this.mesh.add(this.centerGrid());
    }
    if (this.gridConfig.plane.enabled) {
      this.mesh.add(this.plane());
    }
  }

  public getMesh(): THREE.Group {
    return this.mesh;
  }

  private bigGrid(): THREE.LineSegments {
    const halfSize = this.gridConfig.size / 2;

    const vertices: number[] = [];
    const colors: number[] = [];

    for (
      let j = 0, k = -halfSize;
      k <= halfSize;
      k += this.gridConfig.bigGrid.step
    ) {
      vertices.push(-halfSize, k, 0, halfSize, k, 0);
      vertices.push(k, -halfSize, 0, k, halfSize, 0);
      const color: THREE.Color = this.colorBig;
      color.toArray(colors, j);
      j += 3;
      color.toArray(colors, j);
      j += 3;
      color.toArray(colors, j);
      j += 3;
      color.toArray(colors, j);
      j += 3;
    }

    const geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
    geometry.addAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    geometry.addAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: THREE.VertexColors,
      linewidth: this.gridConfig.bigGrid.lineWidth,
      fog: false
    });

    const mesh: THREE.LineSegments = new THREE.LineSegments(geometry, material);
    return mesh;
  }

  private smallGrid(): THREE.LineSegments {
    const halfSize = this.gridConfig.size / 2;
    const vertices: number[] = [];
    const colors: number[] = [];

    for (
      let j = 0, k = -halfSize;
      k <= halfSize;
      k += this.gridConfig.smallGrid.step
    ) {
      vertices.push(-halfSize, k, 0, halfSize, k, 0);
      vertices.push(k, -halfSize, 0, k, halfSize, 0);
      const color: THREE.Color = this.colorSmall;
      color.toArray(colors, j);
      j += 3;
      color.toArray(colors, j);
      j += 3;
      color.toArray(colors, j);
      j += 3;
      color.toArray(colors, j);
      j += 3;
    }

    const geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
    geometry.addAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    geometry.addAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: THREE.VertexColors,
      linewidth: this.gridConfig.smallGrid.lineWidth,
      fog: false
    });
    const mesh: THREE.LineSegments = new THREE.LineSegments(geometry, material);

    return mesh;
  }

  private centerGrid(): THREE.LineSegments {
    const halfSize = this.gridConfig.size / 2;
    const vertices: number[] = [];
    const colors: number[] = [];

    vertices.push(-halfSize, 0, 0, halfSize, 0, 0);
    vertices.push(0, -halfSize, 0, 0, halfSize, 0);

    const color: THREE.Color = this.colorCenter;
    color.toArray(colors, 0);
    color.toArray(colors, 3);
    color.toArray(colors, 6);
    color.toArray(colors, 9);

    const geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
    geometry.addAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    geometry.addAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: THREE.VertexColors,
      linewidth: this.gridConfig.centerGrid.lineWidth,
      fog: false
    });
    const mesh: THREE.LineSegments = new THREE.LineSegments(geometry, material);

    return mesh;
  }

  private plane(): THREE.PlaneHelper {
    const plane: THREE.Plane = new THREE.Plane(new THREE.Vector3(0, 0, 1));
    const helper: THREE.PlaneHelper = new THREE.PlaneHelper(
      plane,
      this.gridConfig.size,
      this.gridConfig.plane.color
    );
    return helper;
  }
}
