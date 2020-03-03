import { v1 as uuid } from "uuid";
import JSZip, { JSZipObject } from "jszip";
import { IFileItem, IFile, IFolder } from "./index";

const addInPath = (files: IFileItem[], item: IFileItem, path: string[]) => {
  if (path.length === 0) {
    files.push(item);
  } else {
    const nextFolder = files.find(f => f.name === path[0]);
    path.shift();
    addInPath((nextFolder as IFolder).files, item, path);
  }
};

export const unzipLibrary = async (url: string) => {
  const files: IFileItem[] = [];
  const response = await fetch(url);
  const blob = await response.blob();
  const zip = await JSZip().loadAsync(blob);
  const jszipFiles: Array<{ path: string[]; file: JSZipObject }> = [];

  zip.forEach((relativePath, file) => {
    const path = relativePath.split("/");
    if (file.dir) {
      path.pop();
      const name = path.pop() || "";
      const newFolder: IFolder = {
        id: uuid(),
        type: "folder",
        name,
        files: []
      };
      addInPath(files, newFolder, path);
    } else {
      jszipFiles.push({ path, file });
    }
  });

  await Promise.all(
    jszipFiles.map(async f => {
      const name = f.path.pop() || "";
      const content = await f.file.async("text");
      const newFile: IFile = {
        id: uuid(),
        type: "file",
        name,
        content
      };
      addInPath(files, newFile, f.path);
    })
  );

  return files;
};
