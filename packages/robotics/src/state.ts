import { atom, atomFamily, selector } from "recoil";
import { IComponentInstance, IConnector } from "@bitbloq/bloqs";

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

interface IDraggingConnector {
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
