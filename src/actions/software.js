export function updateSoftwareBloqs(bloqs) {
  return {
    type: 'UPDATE_SOFTWARE_BLOQS',
    bloqs,
  };
}

export function updateSoftwareCode(code) {
  return {
    type: 'UPDATE_SOFTWARE_CODE',
    code,
  };
}

export function uploadCode() {
  return {
    type: 'UPLOAD_CODE',
  };
}
