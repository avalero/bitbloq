import { IDocumentProps, IDocumentTab, IMainMenuOption } from "@bitbloq/ui";
import { IDocument, IResource, IUser } from "../../api/src/api-types";

export interface IUserBirthDate {
  birthDate: string;
  day?: number;
  month?: number;
  year?: number;
}

export interface IUserData extends IUserBirthDate {
  acceptTerms?: boolean;
  centerName?: string;
  city?: string;
  country?: string;
  educationalStage?: string;
  email?: string;
  imTeacherCheck?: boolean;
  name?: string;
  noNotifications?: boolean;
  password?: string;
  postCode?: number;
  surnames?: string;
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
