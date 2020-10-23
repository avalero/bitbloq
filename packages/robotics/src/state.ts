import { atom, atomFamily, selector } from "recoil";
import { IComponentInstance, IConnector } from "@bitbloq/bloqs";
import { IBloq } from "./types";

interface IPosition {
  x: number;
  y: number;
}

export interface ICanvasComponentInstance extends IComponentInstance {
  position: IPosition;
  height: number;
  width: number;
}

export interface ICanvasBoard {
  name: string;
  width: number;
  height: number;
}

export const boardState = atom<ICanvasBoard | null>({
  key: "board",
  default: null
});

export const componentListState = atom<string[]>({
  key: "componentList",
  default: []
});

export const componentWithIdState = atomFamily<
  ICanvasComponentInstance,
  string
>({
  key: "componentWithId",
  default: {
    name: "",
    component: "",
    width: 0,
    height: 0,
    position: { x: 0, y: 0 }
  }
});

export const componentsState = selector({
  key: "components",
  get: ({ get }) =>
    get(componentListState).map(id => get(componentWithIdState(id)))
});

export const connectedPortsState = selector({
  key: "connectedPorts",
  get: ({ get }) =>
    get(componentsState)
      .flatMap(component =>
        Object.values(component.ports || {}).map(port => ({
          component: component.id,
          port
        }))
      )
      .reduce((acc, { component, port }) => ({ ...acc, [port]: component }), {})
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

export const isDraggingBoardState = selector({
  key: "isDraggingBoard",
  get: ({ get }) => !!get(draggingBoardState).board
});

export interface IDraggingConnector {
  x: number;
  y: number;
  connector: IConnector;
  instance: ICanvasComponentInstance;
}

export const draggingConnectorState = atom<IDraggingConnector | null>({
  key: "draggingConnector",
  default: null
});

export const draggingInstanceState = atom<ICanvasComponentInstance>({
  key: "draggingInstance",
  default: {
    component: "",
    position: { x: 0, y: 0 },
    name: "",
    width: 0,
    height: 0
  }
});

export const isDraggingInstanceState = selector({
  key: "isDraggingInstance",
  get: ({ get }) => !!get(draggingInstanceState).component
});

export const boardSelectedState = atom<boolean>({
  key: "boardSelected",
  default: false
});

export const selectedComponentState = atom<string | null>({
  key: "selectedComponent",
  default: null
});

interface IDraggingBloqs {
  x: number;
  y: number;
  bloqs: IBloq[];
}

export const draggingBloqsState = atom<IDraggingBloqs>({
  key: "draggingBloqs",
  default: {
    x: 0,
    y: 0,
    bloqs: []
  }
});

export const isDraggingParameterState = atom<boolean>({
  key: "isDraggingParamater",
  default: false
});

export enum BloqSection {
  Global = "globals",
  Setup = "setup",
  Loop = "loop"
}

export type BloqState = Record<BloqSection, IBloq[]>;

export const bloqsState = atom<BloqState>({
  key: "bloqs",
  default: {
    globals: [],
    setup: [],
    loop: []
  }
});

export interface CompilingState {
  compiling?: boolean;
  uploading?: boolean;
  visible?: boolean;
  compileSuccess?: boolean;
  compileError?: boolean;
  uploadSuccess?: boolean;
  uploadError?: boolean;
}

export const compilingState = atom<CompilingState>({
  key: "compiling",
  default: {}
});

export const getBloq = (bloqs: IBloq[], path: number[]): IBloq => {
  const [first, ...rest] = path;
  if (path.length > 1) {
    return getBloq(bloqs[first].children || [], rest);
  } else {
    return bloqs[first];
  }
};

export const replaceBloqs = (
  bloqs: IBloq[],
  path: number[],
  deleteCount: number,
  newBloqs: IBloq[]
): IBloq[] => {
  const [first, ...rest] = path;
  if (path.length > 1) {
    return [
      ...bloqs.slice(0, first),
      {
        ...bloqs[first],
        children: replaceBloqs(
          bloqs[first].children || [],
          rest,
          deleteCount,
          newBloqs
        )
      },
      ...bloqs.slice(first + 1)
    ];
  } else {
    return [
      ...bloqs.slice(0, first),
      ...newBloqs,
      ...bloqs.slice(first + deleteCount)
    ];
  }
};
