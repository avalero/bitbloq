import Code from "./Code";

export interface IFile {
  name: string;
  content: string;
}

export interface ICodeContent {
  files: IFile[];
}

export { Code };
