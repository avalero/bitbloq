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
