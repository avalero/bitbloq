const initialState = {
  currentSectionId: 'software'
};

const ui = (state = initialState, action) => {
  switch (action.type) {
    case 'OPEN_SECTION':
      return {
        ...state,
        currentSectionId: action.section
      };
    default:
      return state;
  }
};

export default ui;
