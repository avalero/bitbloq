import { atom, atomFamily } from "recoil";
import { IComponentInstance } from "@bitbloq/bloqs";

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
