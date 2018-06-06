const initialState = {
  bloqs: [{
    type: 'OnButtonPressed',
    x: 100,
    y: 200,
    next: {
      type: 'DigitalWrite',
      next: {
        type: 'DigitalWrite'
      }
    }
  }],
  draggingBloq: null,
  draggingX: 0,
  draggingY: 0,
  draggingOffsetX: 0,
  draggingOffsetY: 0
};

const bloqs = (state = initialState, action) => {
  switch(action.type) {
    case 'START_DRAGGING_BLOQ':
      return {
        ...state,
        draggingBloq: action.bloq,
        draggingX: action.x,
        draggingY: action.y,
        draggingOffsetX: action.offsetX,
        draggingOffsetY: action.offsetY
      };

    case 'DRAG_BLOQ':
      return {
        ...state,
        draggingX: action.x,
        draggingY: action.y
      };

    case 'STOP_DRAGGING_BLOQ':
      return {
        ...state,
        draggingBloq: null,
        bloqs: [
          ...state.bloqs,
          {
            x: state.draggingX - state.draggingOffsetX,
            y: state.draggingY - state.draggingOffsetY
          }
        ]
      };

    default:
      return state;
  }
}

export default bloqs;
