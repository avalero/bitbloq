const initialBoard = {
  className: 'Zumjunior',
};

const initialState = {
  board: initialBoard,
  components: []
};

const hardware = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_COMPONENTS':
      return {
        ...state,
        components: action.components
      };

    default:
      return state;
  }
};

export default hardware;
