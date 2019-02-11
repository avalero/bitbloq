import {createAction} from 'redux-actions';

export const openSection = createAction('UI_OPEN_SECTION');
export const showNotification = createAction(
  'UI_SHOW_NOTIFICATION',
  (key, content, time) => ({key, content, time}),
);
export const hideNotification = createAction('UI_HIDE_NOTIFICATION');
export const keyDown = createAction('UI_KEY_DOWN');
export const keyUp = createAction('UI_KEY_UP');
