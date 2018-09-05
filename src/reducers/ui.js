const initialState = {
  currentSectionId: '3d',
  notifications: {},
  shiftPressed: false,
  controlPressed: false,
  altPressed: false,
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

    case 'KEY_DOWN':
      return {
        ...state,
        shiftPressed: state.shiftPressed || action.key === 'Shift',
        controlPressed: state.controlPressed || action.key === 'Control',
        altPressed: state.altPressed || action.key === 'Alt',
      };

    case 'KEY_UP':
      return {
        ...state,
        shiftPressed: state.shiftPressed && action.key !== 'Shift',
        controlPressed: state.controlPressed && action.key !== 'Control',
        altPressed: state.altPressed && !action.key !== 'Alt',
      };

    default:
      return state;
  }
};

export default ui;
