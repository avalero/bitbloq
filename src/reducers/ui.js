const initialState = {
  currentSectionId: 'software',
  notifications: {},
};

const ui = (state = initialState, action) => {
  switch (action.type) {
    case 'OPEN_SECTION':
      return {
        ...state,
        currentSectionId: action.section,
      };

    case 'SHOW_NOTIFICATION':
      return {
        ...state,
        notifications: {
          ...state.notifications,
          [action.key]: {
            content: action.content,
            key: action.key,
            time: action.time,
          },
        },
      };

    case 'HIDE_NOTIFICATION':
      const {[action.key]: value, ...notifications} = state.notifications;
      return {
        ...state,
        notifications,
      };

    default:
      return state;
  }
};

export default ui;
