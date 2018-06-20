import uuid from 'uuid/v1';

const initialState = {
  bloqs: [],
  snapAreas: [],
  draggingBloq: null,
  draggingOffsetX: 0,
  draggingOffsetY: 0,
};

const getBloqSnapArea = (bloq, offsetX, offsetY) =>
  bloq.next
    ? getBloqSnapArea(bloq.next, offsetX, offsetY + 48)
    : {
        x: offsetX - 40,
        y: offsetY - 40,
        width: 80,
        height: 80,
        bloq,
      };

const generateSnapAreas = bloqs => {
  return bloqs.map(bloq => getBloqSnapArea(bloq, bloq.x, bloq.y + 48));
};

const getSnapArea = (snapAreas, canvasX, canvasY) => {
  return snapAreas.find(
    ({x, y, width, height}) =>
      canvasX > x && canvasX < x + width && canvasY > y && canvasY < y + height,
  );
};

const replaceBloq = (rootBloq, bloq) => {
  if (rootBloq.id === bloq.id) {
    return bloq;
  } else {
    rootBloq.next = replaceBloq(rootBloq.next, bloq);
    return rootBloq;
  }
};

const bloqs = (state = initialState, action) => {
  switch (action.type) {
    case 'START_DRAGGING_BLOQ':
      const snapAreas = generateSnapAreas(state.bloqs);
      return {
        ...state,
        snapAreas,
        draggingBloq: {
          ...action.bloq,
          x: action.x - action.offsetX,
          y: action.y - action.offsetY,
        },
        draggingOffsetX: action.offsetX,
        draggingOffsetY: action.offsetY,
      };

    case 'DRAG_BLOQ':
      const snapArea = getSnapArea(
        state.snapAreas,
        action.canvasX - state.draggingOffsetX,
        action.canvasY - state.draggingOffsetY,
      );

      return {
        ...state,
        snapArea,
        draggingBloq: {
          ...state.draggingBloq,
          x: action.x - state.draggingOffsetX,
          y: action.y - state.draggingOffsetY,
        },
      };

    case 'STOP_DRAGGING_BLOQ':
      let bloqs;
      if (state.snapArea) {
        const newBloq = {
          ...state.draggingBloq,
          id: uuid(),
          x: 0,
          y: 0,
          data: {},
        };
        state.snapArea.bloq.next = newBloq;
        bloqs = [...state.bloqs];
      } else {
        const newBloq = {
          ...state.draggingBloq,
          id: uuid(),
          x: action.x - state.draggingOffsetX,
          y: action.y - state.draggingOffsetY,
          data: {},
        };
        bloqs = [...state.bloqs, newBloq];
      }

      return {
        ...state,
        snapArea: undefined,
        snapAreas: [],
        draggingBloq: null,
        bloqs,
      };

    case 'UPDATE_BLOQ':
      const updatedBloqs = state.bloqs.map(bloq =>
        replaceBloq(bloq, action.bloq),
      );
      return {
        ...state,
        bloqs: updatedBloqs,
      };

    default:
      return state;
  }
};

export default bloqs;
