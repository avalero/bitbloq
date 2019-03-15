export interface IHeaderButton {
  id: string;
  icon: string;
}

export interface ITab {
  icon: JSX.Element;
  content: JSX.Element;
}

export type HeaderButtonClickCallback = (id: string) => any;
