import { IHeaderButton, HeaderButtonClickCallback } from "@bitbloq/ui";

export interface EditorProps {
  content: any;
  onContentChange: (content: any) => any;
  tabIndex: number;
  onTabChange: (index: number) => any;
  getTabs: (mainTabs: any) => any;
  title: string;
  canEditTitle?: boolean;
  onEditTitle?: () => any;
  onSaveDocument?: () => any;
  brandColor: string;
  headerButtons?: IHeaderButton[];
  onHeaderButtonClick?: HeaderButtonClickCallback;
  isPlayground?: boolean;
  headerRightContent?: JSX.Element;
  preMenuContent?: JSX.Element;
  changeAdvancedMode?(mode: boolean): void;
  documentAdvancedMode?: boolean;
  backCallback?():void;
}

export interface Document {
  title: string;
  description: string;
  image: string;
}

export enum ResourcesTypes {
  images = "resource-image",
  objects = "resource-object",
  sounds = "resource-sound", 
  videos  = "resource-video"
}

export interface IResource {
  image?: string;
  title: string;
  type: ResourcesTypes
}
