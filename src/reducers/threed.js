const initialState = {
  code: '',
  bloqs: []
};

const threed = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_THREED_BLOQS':
      return {
        ...state,
        bloqs: action.bloqs,
      };

    case 'UPDATE_THREED_CODE':
      return {
        ...state,
        code: action.code
      };

    default:
      return state;
  }
};

export default threed;
