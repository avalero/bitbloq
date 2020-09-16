import React, { FC, useState, useRef, useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import {
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState
} from "recoil";
import update from "immutability-helper";
import { v1 as uuid } from "uuid";
import {
  IComponent,
  IComponentInstance,
  IHardware,
  IPosition,
  IConnector,
  IPort,
  IPortDirection
} from "@bitbloq/bloqs";
import {
  breakpoints,
  colors,
  Droppable,
  DragAndDropProvider,
  useKeyPressed,
  useResizeObserver,
  useTranslate
} from "@bitbloq/ui";
import useHardwareDefinition from "./useHardwareDefinition";
import useUpdateContent from "./useUpdateContent";
import {
  boardState,
  componentListState,
  componentsState,
  componentWithIdState,
  draggingConnectorState,
  draggingInstanceState,
  selectedComponentState,
  ICanvasComponentInstance
} from "./state";

import Board from "./Board";
import Connections from "./Connections";
import Component from "./Component";
import DraggingBoard from "./DraggingBoard";
import DraggingComponent from "./DraggingComponent";
import DraggingConnector from "./DraggingConnector";
import HardwareTabs from "./HardwareTabs";

const Hardware: FC = () => {
  const t = useTranslate();
  const { getBoard, getComponent } = useHardwareDefinition();
  const updateContent = useUpdateContent();

  const componentRefs = useRef<{
    [id: string]: React.RefObject<HTMLDivElement>;
  }>({});

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const canvasRef = useRef<HTMLDivElement>(null);

  const [board, setBoard] = useRecoilState(boardState);
  const [componentList, setComponentList] = useRecoilState(componentListState);
  const draggingConnector = useRecoilValue(draggingConnectorState);
  const selectedComponent = useRecoilValue(selectedComponentState);

  const addComponentInstance = useRecoilCallback<[IComponent, IPosition], void>(
    ({ set, snapshot }) => async (component, position) => {
      const id = uuid();

      const componentNames = (await snapshot.getPromise(componentsState)).map(
        c => c.name
      );
      const baseName = t(component.instanceName);
      let name = baseName;
      let nameIndex = 1;
      while (componentNames.includes(name)) {
        nameIndex++;
        name = baseName + nameIndex;
      }

      setComponentList([...componentList, id]);
      set(componentWithIdState(id), {
        id,
        component: component.name,
        position,
        name,
        width: 0,
        height: 0
      });
      updateContent();
    }
  );

  const deleteComponentInstance = useRecoilCallback<[string], void>(
    ({ reset }) => id => {
      setComponentList(componentList.filter(c => c !== id));
      reset(componentWithIdState(id));
      updateContent();
    },
    [componentList]
  );

  const addConnection = useRecoilCallback<
    [ICanvasComponentInstance, IConnector, IPort],
    void
  >(({ set }) => (instance, connector, port) => {
    set(componentWithIdState(instance.id || ""), {
      ...instance,
      ports: {
        ...instance.ports,
        [connector.name]: port.name
      }
    });
  });

  useResizeObserver(canvasRef, (canvasWidth, canvasHeight) => {
    setWidth(canvasWidth);
    setHeight(canvasHeight);
  });

  useKeyPressed(
    "Delete",
    () => {
      if (selectedComponent) {
        deleteComponentInstance(selectedComponent);
      }
    },
    [selectedComponent]
  );

  const onDrop = ({
    draggableData,
    droppableData,
    draggableWidth,
    draggableHeight,
    x,
    y
  }) => {
    const { type } = droppableData || {};

    if (type === "board-placeholder") {
      if (draggableData.board) {
        setBoard({
          name: draggableData.board.name,
          width: 0,
          height: 0
        });
      }
    }

    if (type === "canvas") {
      const { component } = draggableData;
      if (component) {
        addComponentInstance(component, {
          x: x - width / 2 + draggableWidth / 2,
          y: y - height / 2 + draggableHeight / 2
        });
      }
    }

    if (type === "port") {
      const { connector, instance } = draggableData;
      const { port } = droppableData;
      if (connector && instance && port) {
        addConnection(instance, connector, port);
      }
    }
  };

  return (
    <DragAndDropProvider onDrop={onDrop}>
      <Container>
        <CanvasWrap data={{ type: "canvas" }} active={!draggingConnector}>
          <Connections width={width} height={height} />
          <Canvas ref={canvasRef}>
            <Board />
            {componentList.map(id => (
              <Component key={id} id={id} />
            ))}
          </Canvas>
        </CanvasWrap>
        <HardwareTabs />
      </Container>
      <DraggingBoard />
      <DraggingComponent />
      <DraggingConnector />
    </DragAndDropProvider>
  );
};

export default Hardware;

const Container = styled.div`
  flex: 1;
  display: flex;
`;

const CanvasWrap = styled(Droppable)`
  flex: 1;
  display: flex;
  position: relative;
`;

const Canvas = styled.div`
  position: relative;
  flex: 1;
  transform: translate(50%, 50%);
`;
