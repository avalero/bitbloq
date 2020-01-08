import { IDocument, IResource, IUser } from "@bitbloq/api";
import { IDocumentProps, IDocumentTab, IMainMenuOption } from "@bitbloq/ui";

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

export interface IEditorProps {
  document: IDocument;
  onDocumentChange: (document: IDocument) => any;
  baseTabs: IDocumentTab[];
  baseMenuOptions: IMainMenuOption[];
  resources?: IResource[];
  user?: IUser;
  children: (documentProps: Partial<IDocumentProps>) => JSX.Element;
}

export interface IPlan {
  name: string;
  bitbloqCloud?: boolean;
  highlightedFeatures?: string[];
  featureTable: string[];
  isFree?: boolean;
  originalPrice?: number;
  price?: number;
  isBetaFree?: boolean;
  ageLimit: number;
}
