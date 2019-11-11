import { IHeaderButton } from "@bitbloq/ui";

export interface EditorProps {
  content: any;
  onContentChange: (content: any) => any;
  tabIndex: number;
  onTabChange: (index: number) => any;
  getTabs: (mainTabs: any) => any;
  title: string;
  onEditTitle?: () => any;
  onSaveDocument?: () => any;
  brandColor: string;
  headerButtons?: IHeaderButton[];
  onHeaderButtonClick?: (id: string) => any;
  isPlayground?: boolean;
  headerRightContent?: React.ReactChild;
  preMenuContent?: React.ReactChild;
  changeAdvancedMode?: (mode: boolean) => any;
  documentAdvancedMode?: boolean;
  backCallback?: () => any;
  t?: (id: string) => string;
}

export interface Document {
  title: string;
  description: string;
  image: any;
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
