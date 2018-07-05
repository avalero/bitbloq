const initialState = {
  code: '',
  bloqs: []
};

const software = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_SOFTWARE_BLOQS':
      return {
        ...state,
        bloqs: action.bloqs,
      };

    case 'UPDATE_SOFTWARE_CODE':
      return {
        ...state,
        code: action.code
      };

    default:
      return state;
  }
};

export default software;
