export function startDraggingBloq(bloq, x, y, offsetX, offsetY) {
  return {
    type: 'START_DRAGGING_BLOQ',
    bloq,
    x,
    y,
    offsetX,
    offsetY,
  };
}

export function dragBloq(x, y, canvasX, canvasY) {
  return {
    type: 'DRAG_BLOQ',
    x,
    y,
    canvasX,
    canvasY
  };
}

export function stopDraggingBloq(x, y) {
  return {
    type: 'STOP_DRAGGING_BLOQ',
    x,
    y,
  };
}
