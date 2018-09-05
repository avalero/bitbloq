export function openSection(section) {
  return {
    type: 'OPEN_SECTION',
    section,
  };
}

export function showNotification(key, content, time) {
  return {
    type: 'SHOW_NOTIFICATION',
    content,
    key,
    time,
  };
}

export function hideNotification(key) {
  return {
    type: 'HIDE_NOTIFICATION',
    key,
  };
}

export function keyDown(key) {
  return {
    type: 'KEY_DOWN',
    key,
  };
}

export function keyUp(key) {
  return {
    type: 'KEY_UP',
    key,
  };
}
