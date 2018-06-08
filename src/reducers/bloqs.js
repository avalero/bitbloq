import {generateCode} from '../lib/code-generation';

const initialBloqs = [
  {
    type: 'OnButtonPressed',
    x: 140,
    y: 200,
    next: {
      type: 'DigitalWrite',
      next: {
        type: 'DigitalWrite'
      }
    }
  }
];

const initialState = {
  bloqs: initialBloqs,
  code: generateCode(initialBloqs),
  draggingBloq: null,
  draggingOffsetX: 0,
  draggingOffsetY: 0
};

const bloqs = (state = initialState, action) => {
  switch(action.type) {
    case 'START_DRAGGING_BLOQ':
      return {
        ...state,
        draggingBloq: {
          ...action.bloq,
          x: action.x - action.offsetX,
          y: action.y - action.offsetY
        },
        draggingOffsetX: action.offsetX,
        draggingOffsetY: action.offsetY
      };

    case 'DRAG_BLOQ':
      return {
        ...state,
        draggingBloq: {
          ...state.draggingBloq,
          x: action.x - state.draggingOffsetX,
          y: action.y - state.draggingOffsetY
        }
      };

    case 'STOP_DRAGGING_BLOQ':
      return {
        ...state,
        draggingBloq: null,
        bloqs: [
          ...state.bloqs,
          state.draggingBloq
        ]
      };

    default:
      return state;
  }
}

export default bloqs;
