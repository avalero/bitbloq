import Triangle, {
  CLASSIFY_BACK,
  CLASSIFY_COPLANAR,
  CLASSIFY_FRONT,
  CLASSIFY_SPANNING,
} from './Triangle';
import { isConvexSet } from './utils';
import { Box3, Face3, Geometry, Matrix4, Vector3 } from 'three';

let recursionLevel: number = 0;
// tslint:disable-next-line:variable-name
let max_recursion: number = 0;

const MINIMUM_RELATION = 0.8; // 0 -> 1
const MINIMUM_RELATION_SCALE = 10; // should always be >2

/**
 * Algorithm adapted from Binary Space Partioning Trees and Polygon Removal in Real Time 3D Rendering
 * Samuel Ranta-Eskola, 2001
 */
function chooseDividingTriangle(triangles: Triangle[]): Triangle | undefined {
  
  return triangles[0];

  if (isConvexSet(triangles)) return triangles[0];

  let minimumRelation = MINIMUM_RELATION;
  let bestTriangle: Triangle | undefined = undefined;
  let leastSplits = Infinity;
  let bestRelation = 0;

  // Find the triangle that best divides the set
  while (bestTriangle === undefined) {
    for (let i = 0; i < triangles.length; i++) {
      const triangleOuter = triangles[i];

      // Count the number of polygons on the positive side, negative side, and spanning the plane defined by the current triangle
      let numFront = 0;
      let numBack = 0;
      let numSpanning = 0;
      for (let j = 0; j < triangles.length; j++) {
        if (i === j) continue;
        const triangleInner = triangles[j];
        const side = triangleOuter.classifySide(triangleInner);

        if (side === CLASSIFY_SPANNING) {
          numSpanning++;
        } else if (side === CLASSIFY_FRONT) {
          numFront++;
        } else if (side === CLASSIFY_BACK) {
          numBack++;
        }
      }

      // Calculate the relation between the number of triangles in the two sets divided by the current triangle
      const relation =
        numFront < numBack ? numFront / numBack : numBack / numFront;

      // Compare the results given by the current triangle to the best so far.
      // If the this triangle splits fewer triangles and the relation
      // between the resulting sets is acceptable this is the new candidate
      // triangle. If the current triangle splits the same amount of triangles
      // as the best triangle so far and the relation between the two
      // resulting sets is better then this triangle is the new candidate
      // triangle.
      if (
        minimumRelation === 0 ||
        (relation > minimumRelation &&
          (numSpanning < leastSplits ||
            (numSpanning === leastSplits && relation > bestRelation)))
      ) {
        bestTriangle = triangleOuter;
        leastSplits = numSpanning;
        bestRelation = relation;
      }
    }
    minimumRelation = minimumRelation / MINIMUM_RELATION_SCALE;
  }

  return bestTriangle;
}

export default class BSPNode {
  divider?: Triangle;
  front?: BSPNode;
  back?: BSPNode;
  triangles: Triangle[];
  isInverted: boolean;
  boundingBox: Box3;

  static interpolateVectors(a: Vector3, b: Vector3, t: number): Vector3 {
    return a.clone().lerp(b, t);
  }

  // tslint:disable-next-line:member-ordering
  static splitTriangle = function splitTriangle(
    triangle: Triangle,
    divider: Triangle,
    frontTriangles: Triangle[],
    backTriangles: Triangle[]
  ) {
    const vertices = [triangle.a, triangle.b, triangle.c];
    const frontVertices: Vector3[] = [];
    const backVertices: Vector3[] = [];

    for (let i = 0; i < 3; i++) {
      const j = (i + 1) % 3;
      const vi = vertices[i];
      const vj = vertices[j];
      const ti = divider.classifyPoint(vi);
      const tj = divider.classifyPoint(vj);

      if (ti != CLASSIFY_BACK) frontVertices.push(vi);
      if (ti != CLASSIFY_FRONT) backVertices.push(vi);
      if ((ti | tj) === CLASSIFY_SPANNING) {
        const t =
          (divider.w - divider.normal.dot(vi)) /
          divider.normal.dot(vj.clone().sub(vi));
        const v = BSPNode.interpolateVectors(vi, vj, t);
        frontVertices.push(v);
        backVertices.push(v);
      }
    }

    if (frontVertices.length >= 3)
      Array.prototype.push.apply(
        frontTriangles,
        BSPNode.verticesToTriangles(frontVertices)
      );
    if (backVertices.length >= 3)
      Array.prototype.push.apply(
        backTriangles,
        BSPNode.verticesToTriangles(backVertices)
      );
  };

  static verticesToTriangles(vertices: Vector3[]): Triangle[] {
    const triangles = [];
    for (let i = 2; i < vertices.length; i++) {
      const a = vertices[0];
      const b = vertices[i - 1];
      const c = vertices[i];
      const triangle = new Triangle(a, b, c);
      triangles.push(triangle);
    }
    return triangles;
  }

  constructor(triangles?: Triangle[]) {
    this.triangles = [];
    this.isInverted = false;
    this.boundingBox = new Box3();

    if (triangles !== undefined) {
      this.buildFrom(triangles);
    }
  }

  buildFrom(triangles: Triangle[]) {
    if (this.divider === undefined) {
      const bestDivider = chooseDividingTriangle(triangles);
      if (bestDivider === undefined) {
        this.divider = triangles[0].clone();
        this.triangles = triangles;
      } else {
        this.divider = bestDivider.clone();
        this.triangles = [];
        this.addTriangles(triangles);
      }
    } else {
      this.addTriangles(triangles);
    }
  }

  private addTriangles(triangles: Triangle[]) {
    const frontTriangles = [];
    const backTriangles = [];

    for (let i = 0; i < triangles.length; i++) {
      const triangle = triangles[i];

      this.boundingBox.min.set(
        Math.min(
          this.boundingBox.min.x,
          triangle.a.x,
          triangle.b.x,
          triangle.c.x
        ),
        Math.min(
          this.boundingBox.min.y,
          triangle.a.y,
          triangle.b.y,
          triangle.c.y
        ),
        Math.min(
          this.boundingBox.min.z,
          triangle.a.z,
          triangle.b.z,
          triangle.c.z
        )
      );
      this.boundingBox.max.set(
        Math.max(
          this.boundingBox.max.x,
          triangle.a.x,
          triangle.b.x,
          triangle.c.x
        ),
        Math.max(
          this.boundingBox.max.y,
          triangle.a.y,
          triangle.b.y,
          triangle.c.y
        ),
        Math.max(
          this.boundingBox.max.z,
          triangle.a.z,
          triangle.b.z,
          triangle.c.z
        )
      );

      const side = this.divider!.classifySide(triangle);

      if (side === CLASSIFY_COPLANAR) {
        this.triangles.push(triangle);
      } else if (side === CLASSIFY_FRONT) {
        frontTriangles.push(triangle);
      } else if (side === CLASSIFY_BACK) {
        backTriangles.push(triangle);
      } else {
        BSPNode.splitTriangle(
          triangle,
          this.divider!,
          frontTriangles,
          backTriangles
        );
      }
    }

    if (frontTriangles.length) {
      if (this.front === undefined) {
        this.front = new BSPNode(frontTriangles);
      } else {
        this.front.addTriangles(frontTriangles);
      }
    }
    if (backTriangles.length) {
      if (this.back === undefined) {
        this.back = new BSPNode(backTriangles);
      } else {
        this.back.addTriangles(backTriangles);
      }
    }
  }

  // tslint:disable-next-line:member-ordering
  invert() {
    this.isInverted = !this.isInverted;

    if (this.divider !== undefined) this.divider.invert();
    if (this.front !== undefined) this.front.invert();
    if (this.back !== undefined) this.back.invert();

    const temp = this.front;
    this.front = this.back;
    this.back = temp;

    for (let i = 0; i < this.triangles.length; i++) {
      this.triangles[i].invert();
    }
  }

  // Remove all triangles in this BSP tree that are inside the other BSP tree
  clipTo(tree: BSPNode) {
    if (
      tree.isInverted === false &&
      this.isInverted === false &&
      this.boundingBox.intersectsBox(tree.boundingBox) === false
    )
      return;
    this.triangles = tree.clipTriangles(this.triangles);
    if (this.front !== undefined) this.front.clipTo(tree);
    if (this.back !== undefined) this.back.clipTo(tree);
  }

  // Recursively remove all triangles from `triangles` that are inside this BSP tree
  clipTriangles(triangles: Triangle[]): Triangle[] {
    if (!this.divider) return triangles.slice();

    let frontTriangles: Triangle[] = [];
    let backTriangles: Triangle[] = [];

    // not a leaf node / convex set
    for (let i = 0; i < triangles.length; i++) {
      const triangle = triangles[i];
      const side = this.divider.classifySide(triangle);

      if (side === CLASSIFY_FRONT) {
        frontTriangles.push(triangle);
      } else if (side === CLASSIFY_BACK) {
        backTriangles.push(triangle);
      } else if (side == CLASSIFY_COPLANAR) {
        const dot = this.divider.normal.dot(triangle.normal);
        if (dot > 0) {
          frontTriangles.push(triangle);
        } else {
          backTriangles.push(triangle);
        }
      } else if (side === CLASSIFY_SPANNING) {
        BSPNode.splitTriangle(
          triangle,
          this.divider,
          frontTriangles,
          backTriangles
        );
      }
    }

    if (this.front !== undefined)
      frontTriangles = this.front.clipTriangles(frontTriangles);
    if (this.back !== undefined) {
      backTriangles = this.back.clipTriangles(backTriangles);
    } else {
      backTriangles = [];
    }

    return frontTriangles.concat(backTriangles);
  }

  getTriangles(): Triangle[] {
    let triangles = this.triangles.slice();

    if (this.front !== undefined)
      triangles = triangles.concat(this.front.getTriangles());
    if (this.back !== undefined)
      triangles = triangles.concat(this.back.getTriangles());

    return triangles;
  }

  clone(transform?: Matrix4): BSPNode {
    const clone = new BSPNode();

    clone.isInverted = this.isInverted;

    clone.boundingBox.min.copy(this.boundingBox.min);
    clone.boundingBox.max.copy(this.boundingBox.max);

    if (transform) {
      clone.boundingBox.min.applyMatrix4(transform);
      clone.boundingBox.max.applyMatrix4(transform);
    }

    if (this.divider !== undefined) {
      clone.divider = this.divider.clone();
      if (transform) {
        clone.divider.a.applyMatrix4(transform);
        clone.divider.b.applyMatrix4(transform);
        clone.divider.c.applyMatrix4(transform);
      }
    }
    if (this.front !== undefined) clone.front = this.front.clone(transform);
    if (this.back !== undefined) clone.back = this.back.clone(transform);

    const clonedTriangles = [];
    for (let i = 0; i < this.triangles.length; i++) {
      const clonedTriangle = this.triangles[i].clone();
      if (transform) {
        clonedTriangle.a.applyMatrix4(transform);
        clonedTriangle.b.applyMatrix4(transform);
        clonedTriangle.c.applyMatrix4(transform);
        clonedTriangle.computeNormal();
      }
      clonedTriangles.push(clonedTriangle);
    }
    clone.triangles = clonedTriangles;

    return clone;
  }

  toGeometry(): Geometry {
    const geometry = new Geometry();

    const triangles = this.getTriangles();
    for (let i = 0; i < triangles.length; i++) {
      const triangle = triangles[i];
      const vertexIndex = geometry.vertices.length;
      geometry.vertices.push(triangle.a, triangle.b, triangle.c);

      const face = new Face3(
        vertexIndex,
        vertexIndex + 1,
        vertexIndex + 2,
        triangle.normal
      );
      geometry.faces.push(face);
    }

    return geometry;
  }
}
