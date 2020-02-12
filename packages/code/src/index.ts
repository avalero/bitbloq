import Code from "./Code";
import useCodeUpload from "./useCodeUpload";

export interface IFile {
  name: string;
  content: string;
}

export interface ICodeContent {
  files: IFile[];
}

export { Code, useCodeUpload };
