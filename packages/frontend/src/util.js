import dayjs from "dayjs";
import { colors } from "@bitbloq/ui";

export const getChromeVersion = userAgent => {
  if (userAgent) {
    const pieces = userAgent.match(
      /Chrom(?:e|ium)\/([0-9]+)\.([0-9]+)\.([0-9]+)\.([0-9]+)/
    );
    return pieces && pieces[1] ? parseInt(pieces[1]) : 0;
  } else {
    return 0;
  }
};

export const getAge = birthDate =>
  dayjs().diff(
    dayjs(
      new Date(
        parseInt(birthDate.split("/")[2], 10),
        parseInt(birthDate.split("/")[1], 10) - 1,
        parseInt(birthDate.split("/")[0], 10)
      )
    ),
    "year"
  );

export const getAvatarColor = userId =>
  [
    colors.green,
    colors.brandBlue,
    colors.brandOrange,
    colors.brandPink,
    colors.brandYellow
  ][parseInt(userId, 16) % 5];

export const isValidAge = (birthDate, ageLimit) => {
  return getAge(birthDate) >= ageLimit;
};

export const isValidDate = date =>
  /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/i.test(date) &&
  new Date(
    date.split("/")[2],
    date.split("/")[1] - 1,
    date.split("/")[0]
  ).getMonth() ===
    date.split("/")[1] - 1;

export const isValidEmail = email =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

export const isValidName = name => {
  if (
    !name ||
    (name.length <= 64 &&
      name.match(/^[\w\sÁÉÍÓÚÑáéíóúñ]+$/) &&
      !name.match(/^\s+$/))
  ) {
    return true;
  } else {
    return false;
  }
};

export const sortByCreatedAt = (a, b) => {
  const aCreatedAt = a && a.createdAt;
  const bCreatedAt = b && b.createdAt;
  return Math.sign(bCreatedAt - aCreatedAt);
};

export const dataURItoBlob = dataURI => {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString;
  if (dataURI.split(",")[0].indexOf("base64") >= 0)
    byteString = atob(dataURI.split(",")[1]);
  else byteString = unescape(dataURI.split(",")[1]);

  // separate out the mime component
  let mimeString = dataURI
    .split(",")[0]
    .split(":")[1]
    .split(";")[0];

  // write the bytes of the string to a typed array
  let ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
};
