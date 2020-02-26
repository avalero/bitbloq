import Code, { ICodeRef as ICodeRefImported } from "./Code";
import useCodeUpload from "./useCodeUpload";

export interface IFile {
  name: string;
  content: string;
}

export interface ILibrary {
  name: string;
  zipURL: string;
}

export interface ICodeContent {
  files: IFile[];
  libraries: ILibrary[];
}

export { Code, useCodeUpload };

export type ICodeRef = ICodeRefImported;
