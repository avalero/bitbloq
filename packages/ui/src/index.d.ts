declare namespace BBUI {
  export interface HeaderButton {
    id: string;
    icon: string;
  }

  export type HeaderButtonClickCallback = (id: string) => any;
}
