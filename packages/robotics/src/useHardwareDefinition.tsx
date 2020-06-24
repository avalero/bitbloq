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

const useHardwareDefinition = () => {
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

  return { boards, components, getBoard, getComponent };
};

export default useHardwareDefinition;
