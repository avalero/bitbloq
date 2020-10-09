import React, { FC, createContext, useContext } from "react";
import { IBoard, IComponent } from "@bitbloq/bloqs";

export interface IHardwareDefinitionContext {
  boards: IBoard[];
  boardsMap: Record<string, IBoard>;
  components: IComponent[];
  componentsMap: Record<string, IComponent>;
}

export const HardwareDefinitionContext = createContext<
  IHardwareDefinitionContext
>({ boards: [], components: [], boardsMap: {}, componentsMap: {} });

export interface IHardwareDefinitionProviderProps {
  boards: IBoard[];
  components: IComponent[];
}

export const HardwareDefinitionProvider: FC<IHardwareDefinitionProviderProps> = ({
  boards,
  components,
  children
}) => {
  const boardsMap = boards.reduce((map, b) => ({ ...map, [b.name]: b }), {});
  const componentsMap = components.reduce(
    (map, c) => ({ ...map, [c.name]: c }),
    {}
  );

  return (
    <HardwareDefinitionContext.Provider
      value={{ boards, components, boardsMap, componentsMap }}
    >
      {children}
    </HardwareDefinitionContext.Provider>
  );
};

interface IUseHardwareDefinition {
  boards: IBoard[];
  components: IComponent[];
  getBoard: (name: string) => IBoard;
  getComponent: (name: string) => IComponent;
  isInstanceOf: (name: string, base: string) => boolean;
}
const useHardwareDefinition = (): IUseHardwareDefinition => {
  const { boards, components, boardsMap, componentsMap } = useContext(
    HardwareDefinitionContext
  );

  const getBoard = (name: string) => boardsMap[name];
  const getComponent = (name: string) => componentsMap[name];

  const isInstanceOf = (name: string, base: string) =>
    name === base ||
    (componentsMap[name].extends &&
      isInstanceOf(componentsMap[name].extends, base));

  return { boards, components, getBoard, getComponent, isInstanceOf };
};

export default useHardwareDefinition;
