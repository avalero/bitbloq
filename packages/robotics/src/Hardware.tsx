import React, { FC, useState, useRef } from "react";
import styled from "@emotion/styled";
import {
  useRecoilCallback,
  useSetRecoilState,
  useResetRecoilState,
  useRecoilState
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
  draggingBoardState,
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
  const updateContent = useUpdateContent();

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const canvasRef = useRef<HTMLDivElement>(null);

  const setDraggingBoard = useSetRecoilState(draggingBoardState);
  const setDraggingInstance = useSetRecoilState(draggingInstanceState);
  const resetDraggingBoard = useResetRecoilState(draggingBoardState);
  const resetDraggingConnector = useResetRecoilState(draggingConnectorState);
  const resetDraggingInstance = useResetRecoilState(draggingInstanceState);
  const setBoard = useSetRecoilState(boardState);
  const [componentList, setComponentList] = useRecoilState(componentListState);
  const [draggingConnector, setDraggingConnector] = useRecoilState(
    draggingConnectorState
  );
  const [selectedComponent, setSelectedComponent] = useRecoilState(
    selectedComponentState
  );

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

      set(componentWithIdState(id), {
        id,
        component: component.name,
        position,
        name,
        width: 0,
        height: 0
      });
      setComponentList([...componentList, id]);
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
    updateContent();
  });

  const removeConnection = useRecoilCallback(
    ({ set }) => (
      connector: IConnector,
      instance: ICanvasComponentInstance
    ) => {
      const ports = Object.keys(instance.ports || {}).reduce((o, key) => {
        if (key !== connector.name) {
          o[key] = instance.ports?.[key];
        }
        return o;
      }, {});

      set(componentWithIdState(instance.id || ""), {
        ...instance,
        ports
      });
      updateContent();
    }
  );

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

  const onDragStart = ({ draggableData }) => {
    if (draggableData.type === "connector") {
      removeConnection(draggableData.connector, draggableData.instance);
      setSelectedComponent(draggableData.instance.id);
    }
  };

  const onDrag = ({ draggableData, x, y }) => {
    if (draggableData.board) {
      setDraggingBoard({
        board: draggableData.board.name,
        x,
        y
      });
    }
    if (draggableData.component) {
      setDraggingInstance({
        name: "",
        width: 0,
        height: 0,
        component: draggableData.component.name,
        position: {
          x,
          y
        }
      });
    }
    if (draggableData.type === "connector") {
      const { connector, instance } = draggableData;
      setDraggingConnector({ x, y, connector, instance });
    }
  };

  const onDragEnd = () => {
    resetDraggingBoard();
    resetDraggingConnector();
    resetDraggingInstance();
  };

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
        updateContent();
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
    <DragAndDropProvider
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
    >
      <Container>
        <CanvasWrap data={{ type: "canvas" }} active={!draggingConnector}>
          <Canvas ref={canvasRef}>
            <Board />
          </Canvas>
          <Connections />
          <Canvas>
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
  position: absolute;
  flex: 1;
  transform: translate(50%, 50%);
  width: 100%;
  height: 100%;
`;
