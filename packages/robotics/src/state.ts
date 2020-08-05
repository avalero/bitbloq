import { atom, atomFamily, selector } from "recoil";
import { IBoard, IComponentInstance, IConnector } from "@bitbloq/bloqs";

export const componentListState = atom<string[]>({
  key: "componentList",
  default: []
});

export const componentWithIdState = atomFamily<IComponentInstance, string>({
  key: "componentWithId",
  default: {
    name: "",
    component: ""
  }
});

export const componentsState = selector({
  key: "components",
  get: ({ get }) =>
    get(componentListState).map(id => get(componentWithIdState(id)))
});

export interface IDraggingBoard {
  x: number;
  y: number;
  board: string;
}

export const draggingBoardState = atom<IDraggingBoard>({
  key: "draggingBoard",
  default: { board: "", x: 0, y: 0 }
});

export interface IDraggingConnector {
  x: number;
  y: number;
  connector: IConnector;
}

export const draggingConnectorState = atom<IDraggingConnector | null>({
  key: "draggingConnector",
  default: null
});

export const draggingInstanceState = atom<IComponentInstance>({
  key: "draggingComponent",
  default: { component: "" }
});
