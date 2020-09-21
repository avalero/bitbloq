import React, { FC, useState, useRef } from "react";
import styled from "@emotion/styled";
import {
  useRecoilCallback,
  useSetRecoilState,
  useRecoilState,
  useRecoilValue
} from "recoil";
import { v1 as uuid } from "uuid";
import { IComponent, IPosition, IConnector, IPort } from "@bitbloq/bloqs";
import {
  Droppable,
  DragAndDropProvider,
  useKeyPressed,
  useResizeObserver,
  useTranslate
} from "@bitbloq/ui";
import useUpdateContent from "./useUpdateContent";
import {
  boardState,
  componentListState,
  componentsState,
  componentWithIdState,
  draggingConnectorState,
  selectedComponentState,
  ICanvasComponentInstance
} from "./state";

import Board from "./Board";
import Connections from "./Connections";
import Component from "./Component";
import DeleteDroppable from "./DeleteDroppable";
import DraggingBoard from "./DraggingBoard";
import DraggingComponent from "./DraggingComponent";
import DraggingConnector from "./DraggingConnector";
import HardwareTabs from "./HardwareTabs";

const Hardware: FC = () => {
  const t = useTranslate();
  const updateContent = useUpdateContent();

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const canvasRef = useRef<HTMLDivElement>(null);

  const setBoard = useSetRecoilState(boardState);
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

  useResizeObserver(
    canvasRef,
    ({ width: canvasWidth, height: canvasHeight }) => {
      setWidth(canvasWidth);
      setHeight(canvasHeight);
    }
  );

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
          <Connections />
          <Canvas ref={canvasRef}>
            <Board />
            {componentList.map(id => (
              <Component key={id} id={id} />
            ))}
          </Canvas>
        </CanvasWrap>
        <HardwareTabs />
        <DeleteDroppable />
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
