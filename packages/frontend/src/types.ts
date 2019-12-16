import { IDocumentProps, IDocumentTab, IMainMenuOption } from "@bitbloq/ui";

export interface IUser {
  admin: boolean;
  avatar: string;
  birthDate: Date;
  email: string;
  id: string;
  name: string;
  password: string;
  publisher: boolean;
  rootFolder: string;
  surnames: string;
  teacher: boolean;
}

export interface IUserData {
  acceptTerms: boolean;
  birthDate: string;
  centerName: string;
  city: string;
  country: string;
  day: number;
  educationalStage: string;
  email: string;
  imTeacherCheck: boolean;
  month: number;
  name: string;
  noNotifications: boolean;
  password: string;
  postCode: number;
  surnames: string;
  year: number;
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

export interface IDocument {
  id: string;
  title: string;
  description: string;
  image: IDocumentImage | string;
  content: any;
  advancedMode?: boolean;
  type?: string;
  example?: boolean;
  public?: boolean;
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
