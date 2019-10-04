export const sortByCreatedAt = (a, b) => {
  const aCreatedAt = a && a.createdAt;
  const bCreatedAt = b && b.createdAt;

  if (aCreatedAt < bCreatedAt) {
    return 1;
  }
  if (aCreatedAt > bCreatedAt) {
    return -1;
  }
  return 0;
};

export const sortByUpdatedAt = (a, b) => {
  const aUpdatedAt = a && a.updatedAt;
  const bUpdatedAt = b && b.updatedAt;

  if (aUpdatedAt < bUpdatedAt) {
    return 1;
  }
  if (aUpdatedAt > bUpdatedAt) {
    return -1;
  }
  return 0;
};

export const sortByTitleAZ = (a, b) => {
  const aTitle = a && (a.title ? a.title : a.name).toLowerCase();
  const bTitle = b && (b.title ? b.title : b.name).toLowerCase();

  if (aTitle < bTitle) {
    return -1;
  }
  if (aTitle > bTitle) {
    return 1;
  }
  return 0;
};

export const sortByTitleZA = (a, b) => {
  const aTitle = a && (a.title ? a.title : a.name).toLowerCase();
  const bTitle = b && (b.title ? b.title : b.name).toLowerCase();

  if (aTitle < bTitle) {
    return 1;
  }
  if (aTitle > bTitle) {
    return -1;
  }
  return 0;
};

export const getChromeVersion = () => {
  if (typeof navigator !== `undefined`) {
    const pieces = navigator.userAgent.match(
      /Chrom(?:e|ium)\/([0-9]+)\.([0-9]+)\.([0-9]+)\.([0-9]+)/
    );
    return pieces && pieces[1] ? parseInt(pieces[1]) : 0;
  } else {
    return 0;
  }
};

export const isValidEmail = email =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
