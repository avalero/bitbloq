import BSPNode from './BSPNode';

/**
 * Performs union of an array fo BSPNode
 * @param bspArr
 */

export function unionArray(bspArr: BSPNode[]): BSPNode {
  // If array has two BSPs just perform union

  if (bspArr.length === 2) {
    return union(bspArr[0], bspArr[1]);
  }

  // Else create a new array performing union in couples and then recurse
  const arr: BSPNode[] = [];

  for (let i = 0; i < bspArr.length - 1; i += 2) {
    arr.push(union(bspArr[i], bspArr[i + 1]));
  }

  if (bspArr.length % 2 !== 0) {
    arr.push(bspArr[bspArr.length - 1]);
  }

  return unionArray(arr);
}

export function intersect(a: BSPNode, b: BSPNode): BSPNode {
  const a2 = a.clone();
  const b2 = b.clone();
  a2.invert();
  b2.clipTo(a2);
  b2.invert();
  a2.clipTo(b2);
  b2.clipTo(a2);
  a2.invert();
  b2.invert();
  a2.buildFrom(b2.getTriangles());
  return a2;
}

export function union(a: BSPNode, b: BSPNode) {
  const a2 = a.clone();
  const b2 = b.clone();
  a2.clipTo(b2);
  b2.clipTo(a2);
  b2.invert();
  b2.clipTo(a2);
  b2.invert();
  a2.buildFrom(b2.getTriangles());
  return a2;
}

export function subtract(a: BSPNode, b: BSPNode) {
  const a2 = a.clone();
  const b2 = b.clone();
  a2.invert();
  a2.clipTo(b2);
  b2.clipTo(a2);
  b2.invert();
  b2.clipTo(a2);
  a2.invert();
  a2.buildFrom(b2.getTriangles());
  return a2;
}
