import { IFolder, FolderModel } from "./models/folder";

/**
 * Función para conseguir todas las carpetas padres de la carpeta pasada como parámetro
 * @param folder carpeta de la que se quieren obtener los padres
 * @param path listado de padres
 */
export const getParentsPath = async (folder: IFolder, path: IFolder[] = []) => {
  if (folder.name === "root") {
    return [folder, ...path];
  } else {
    const parentFolder = await FolderModel.findOne({ _id: folder.parent });
    const result = await getParentsPath(parentFolder, [folder]);
    return [...result, ...path];
  }
};

export enum OrderType {
  Creation = "createdAt",
  Modification = "updatedAt",
  NameAZ = "alfAZ",
  NameZA = "alfZA"
}

export const orderOptions = [
  {
    label: "Orden: Creación",
    value: OrderType.Creation
  },
  {
    label: "Orden: Modificación",
    value: OrderType.Modification
  },
  {
    label: "Orden: Nombre A-Z",
    value: OrderType.NameAZ
  },
  {
    label: "Orden: Nombre Z-A",
    value: OrderType.NameZA
  }
];

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
  try {
    const aTitle = a && (a.title ? a.title : a.name).toLowerCase();
    const bTitle = b && (b.title ? b.title : b.name).toLowerCase();

    if (aTitle < bTitle) {
      return -1;
    }
    if (aTitle > bTitle) {
      return 1;
    }
    return 0;
  } catch (e) {}
};

export const sortByTitleZA = (a, b) => {
  try {
    const aTitle = a && (a.title ? a.title : a.name).toLowerCase();
    const bTitle = b && (b.title ? b.title : b.name).toLowerCase();

    if (aTitle < bTitle) {
      return 1;
    }
    if (aTitle > bTitle) {
      return -1;
    }
    return 0;
  } catch (e) {}
};

export const orderFunctions = {
  [OrderType.Creation]: sortByCreatedAt,
  [OrderType.Modification]: sortByUpdatedAt,
  [OrderType.NameAZ]: sortByTitleAZ,
  [OrderType.NameZA]: sortByTitleZA
};
