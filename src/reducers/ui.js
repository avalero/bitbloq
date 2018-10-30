import {handleActions} from 'redux-actions';
import {
  showNotification,
  hideNotification,
  keyDown,
  keyUp,
  appClick,
} from '../actions/ui';

const initialState = {
  currentSectionId: '3d',
  notifications: {},
  shiftPressed: false,
  controlPressed: false,
  altPressed: false,
};

const ui = handleActions(
  new Map([
    [
      showNotification,
      (state, {payload}) => ({
        ...state,
        notifications: {
          ...state.notifications,
          [payload.key]: payload
        },
      })
    ],
    [
      hideNotification,
      (state, {payload}) => {
        const {[payload]: value, ...notifications} = state.notifications;
        return {
          ...state,
          notifications,
        };
      }
    ],
    [
      keyDown,
      (state, {payload}) => ({
        ...state,
        shiftPressed: state.shiftPressed || payload === 'Shift',
        controlPressed: state.controlPressed || payload === 'Control',
        altPressed: state.altPressed || payload === 'Alt',
      })
    ],
    [
      keyUp,
      (state, {payload}) => ({
        ...state,
        shiftPressed: state.shiftPressed && payload !== 'Shift',
        controlPressed: state.controlPressed && payload !== 'Control',
        altPressed: state.altPressed && payload !== 'Alt',
      })
    ]
  ]),
  initialState
);

export default ui;
