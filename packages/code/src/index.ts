import Code, { ICodeRef as ICodeRefImported } from "./Code";
import NoBoardWizard from "./NoBoardWizard";
import { knownBoards } from "./config";
import useCodeUpload from "./useCodeUpload";

export interface IError {
  column: number;
  line: number;
  message: string;
  file: string;
}

export interface IFile {
  type: "file";
  id: string;
  name: string;
  content: string;
}

export interface IFolder {
  type: "folder";
  id: string;
  name: string;
  files: IFileItem[];
}

export type IFileItem = IFile | IFolder;

export interface ILibrary {
  name: string;
  zipURL: string;
  files?: IFileItem[];
}

export interface ICodeContent {
  files: IFileItem[];
  libraries: ILibrary[];
}

export { Code, knownBoards, NoBoardWizard, useCodeUpload };

export type ICodeRef = ICodeRefImported;
