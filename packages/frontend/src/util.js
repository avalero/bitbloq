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

export const sortByTitle = (a, b) => {
  const aTitle = a && a.title;
  const bTitle = b && b.title;

  if (aTitle < bTitle) {
    return -1;
  }
  if (bTitle > bTitle) {
    return 1;
  }
  return 0;
};

export const getChromeVersion = () => {
  const pieces = navigator.userAgent.match(
    /Chrom(?:e|ium)\/([0-9]+)\.([0-9]+)\.([0-9]+)\.([0-9]+)/
  );
  return pieces && pieces[1] ? parseInt(pieces[1]) : 0;
};

export const isValidEmail = email =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
