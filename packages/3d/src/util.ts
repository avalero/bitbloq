import config from "./config";
import { IObjectsCommonJSON, ICompoundObjectJSON } from "@bitbloq/lib3d";

type IObject = IObjectsCommonJSON;
type ObjectMatchFn = (object: IObject) => boolean;

export const findObject = (
  objects: IObject[] = [],
  fn: ObjectMatchFn
): IObject | undefined => {
  if (!objects.length) {
    return undefined;
  }
  const [first, ...rest] = objects;
  if (fn(first)) {
    return first;
  }

  return (
    findObject((first as ICompoundObjectJSON).children || [], fn) ||
    findObject(rest, fn)
  );
};

export const createObjectName = (base: string, objects: IObject[]) => {
  let name = base;
  let nameIndex = 1;
  while (findObject(objects, object => object.viewOptions.name === name)) {
    nameIndex++;
    name = base + nameIndex;
  }
  return name;
};

export const getRandomColor = (): string =>
  config.colors[Math.floor(Math.random() * config.colors.length)];
