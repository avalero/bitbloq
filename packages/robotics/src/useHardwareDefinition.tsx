import React, { FC, createContext, useContext, useMemo } from "react";
import { IBoard, IComponent } from "@bitbloq/bloqs";
import styled from "@emotion/styled";

export interface IHardwareDefinitionContext {
  boards: IBoard[];
  components: IComponent[];
}

export const HardwareDefinitionContext = createContext<
  IHardwareDefinitionContext
>({ boards: [], components: [] });

export const HardwareDefinitionProvider: FC<IHardwareDefinitionContext> = ({
  boards,
  components,
  children
}) => {
  return (
    <HardwareDefinitionContext.Provider value={{ boards, components }}>
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
  const { boards, components } = useContext(HardwareDefinitionContext);

  const boardsMap: { [name: string]: IBoard } = useMemo(
    () => boards.reduce((map, b) => ({ ...map, [b.name]: b }), {}),
    [boards]
  );

  const componentsMap: { [name: string]: IComponent } = useMemo(
    () => components.reduce((map, c) => ({ ...map, [c.name]: c }), {}),
    [components]
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
