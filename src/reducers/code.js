const initialState = {
  code: ''
};

const code = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_CODE':
      return {
        ...state,
        code: action.code
      };

    default:
      return state;
  }
};

export default code;
