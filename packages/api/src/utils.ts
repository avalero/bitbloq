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
