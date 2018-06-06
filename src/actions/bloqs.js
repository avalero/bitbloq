export function startDraggingBloq(bloq, x, y, offsetX, offsetY) {
  return {
    type: 'START_DRAGGING_BLOQ',
    bloq,
    x,
    y,
    offsetX,
    offsetY
  };
}

export function dragBloq(x, y) {
  return {
    type: 'DRAG_BLOQ',
    x,
    y
  };
}

export function stopDraggingBloq() {
  return {
    type: 'STOP_DRAGGING_BLOQ'
  };
}
