import { IDocumentProps, IDocumentTab, IMainMenuOption } from "@bitbloq/ui";

export interface IEditorProps {
  document: IDocument;
  onDocumentChange: (document: IDocument) => any;
  baseTabs: IDocumentTab[];
  baseMenuOptions: IMainMenuOption[];
  children: (documentProps: Partial<IDocumentProps>) => JSX.Element;
}

export interface IDocument {
  title: string;
  description: string;
  image: IDocumentImage | string;
  content: any;
  advancedMode?: boolean;
}

export interface IDocumentImage {
  image: string;
  isSnapshot: boolean;
}

export enum OrderType {
  Creation = "creation",
  Modification = "modification",
  NameAZ = "nameAZ",
  NameZA = "nameZA"
}

export enum ResourcesTypes {
  image = "image",
  object3D = "object3D",
  sound = "sound",
  video = "video"
}

export interface IResource {
  createdAt: Date;
  deleted: boolean;
  id: string;
  file: string;
  preview?: string;
  size: number; // Bytes
  thumbnail?: string;
  title: string;
  type: ResourcesTypes;
}
