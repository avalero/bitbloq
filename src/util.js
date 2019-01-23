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
}

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
}
