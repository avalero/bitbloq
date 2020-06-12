import React, { FC, useState, useRef, useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { useRecoilCallback, useRecoilState } from "recoil";
import update from "immutability-helper";
import { v1 as uuid } from "uuid";
import {
  IComponentInstance,
  IHardware,
  IPosition,
  IConnector,
  IPortDirection
} from "@bitbloq/bloqs";
import {
  breakpoints,
  colors,
  Draggable,
  Droppable,
  DragAndDropProvider,
  Icon,
  useTranslate
} from "@bitbloq/ui";
import useHardwareDefinition from "./useHardwareDefinition";
import { componentListState, componentWithIdState } from "./state";

import Component from "./Component";
import DraggableComponent from "./DraggableComponent";
import HardwareTabs from "./HardwareTabs";

export interface IHardwareProps {
  hardware: Partial<IHardware>;
  onChange: (newHardware: Partial<IHardware>) => void;
}

const getConnectionPath = (
  x1: number,
  y1: number,
  d1: IPortDirection,
  x2: number,
  y2: number,
  d2: IPortDirection
) => {
  let path = `M ${x1} ${y1} `;
  if (d1 === IPortDirection.South) {
    path += `L ${x1} ${(y1 + y2) / 2}`;
    path += `L ${x2} ${(y1 + y2) / 2}`;
  }

  path += `L ${x2} ${y2}`;

  return path;
};

const Hardware: FC<IHardwareProps> = ({ hardware, onChange }) => {
  const t = useTranslate();

  const { getBoard, getComponent } = useHardwareDefinition();

  const componentRefs = useRef<{
    [id: string]: React.RefObject<HTMLDivElement>;
  }>({});

  const getComponentRef = (component: IComponentInstance) => {
    if (!component.id) {
      return null;
    }
    const refs = componentRefs.current!;
    if (!refs[component.id]) {
      refs[component.id] = React.createRef();
    }
    return refs[component.id];
  };

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const boardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [draggingConnector, setDraggingConnector] = useState<IConnector | null>(
    null
  );

  const [boardSelected, setBoardSelected] = useState(false);

  const boardObject = getBoard(hardware.board || "");

  const getInstanceName = (baseName: string, count: number = 0): string => {
    const name = `${baseName}${count || ""}`;
    const exist =
      hardware.components && hardware.components.some(c => c.name === name);
    return exist ? getInstanceName(baseName, count ? count + 1 : 2) : name;
  };

  const [componentList, setComponentList] = useRecoilState(componentListState);

  const addComponentInstance = useRecoilCallback(
    ({ set }, component, position) => {
      const id = uuid();
      setComponentList([...componentList, id]);
      set(componentWithIdState(id), {
        id,
        component: component.name,
        position,
        name: getInstanceName(t(component.instanceName))
      });
    }
  );

  useEffect(() => {
    const onResize = () => {
      const {
        width: canvasWidth,
        height: canvasHeight
      } = canvasRef.current!.getBoundingClientRect();

      setWidth(canvasWidth);
      setHeight(canvasHeight);
    };

    onResize();

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onBodyClick = (e: MouseEvent) => {
      if (
        boardRef.current &&
        !boardRef.current.contains(e.target as HTMLElement)
      ) {
        setBoardSelected(false);
      }
    };

    document.addEventListener("click", onBodyClick);
    return () => {
      document.removeEventListener("click", onBodyClick);
    };
  }, []);

  const onDragStart = ({ draggableData }) => {
    const { type, connector } = draggableData;
    if (type === "connector") {
      setDraggingConnector(connector);
    }
  };

  const onDragEnd = () => {
    setDraggingConnector(null);
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
      const { board } = draggableData;
      if (board) {
        onChange({ ...hardware, board: board.name });
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

      const componentIndex = hardware.components!.indexOf(instance);

      onChange(
        update(hardware, {
          components: {
            [componentIndex]: {
              ports: {
                $set: {
                  ...instance.ports,
                  [connector.name]: port.name
                }
              }
            }
          }
        })
      );
    }
  };

  return (
    <DragAndDropProvider
      onDragStart={onDragStart}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      <Container>
        <CanvasWrap data={{ type: "canvas" }} active={!draggingConnector}>
          {boardObject && (
            <Connections>
              <g transform={`translate(${width / 2},${height / 2})`}>
                {(hardware.components || []).map(instance => {
                  const component = getComponent(instance.component);
                  const ports = instance.ports || {};

                  return Object.keys(ports).map(connector => {
                    const port = ports[connector];
                    const connectorObject = component.connectors.find(
                      c => c.name === connector
                    );
                    const portObject = boardObject.ports.find(
                      p => p.name === port
                    );

                    const componentRef = getComponentRef(instance);
                    const componentEl = componentRef && componentRef.current;

                    if (
                      !connectorObject ||
                      !portObject ||
                      !instance.position ||
                      !componentEl
                    ) {
                      return;
                    }

                    const {
                      width: componentWidth,
                      height: componentHeight
                    } = componentEl.getBoundingClientRect();

                    const connectorX =
                      instance.position.x +
                      (connectorObject.position.x / 2) * componentWidth;
                    const connectorY =
                      instance.position.y +
                      (connectorObject.position.y / 2) * componentHeight;

                    const portX =
                      portObject.position.x + (portObject.width || 0) / 2;
                    const portY =
                      portObject.position.y + (portObject.height || 0) / 2;

                    const path = getConnectionPath(
                      connectorX,
                      connectorY,
                      connectorObject.direction || IPortDirection.South,
                      portX,
                      portY,
                      portObject.direction
                    );

                    return <Connection d={path} />;
                  });
                })}
              </g>
            </Connections>
          )}
          <Canvas ref={canvasRef}>
            {boardObject ? (
              <Board
                ref={boardRef}
                image={boardObject.image.url}
                selected={boardSelected}
                dragging={!!draggingConnector}
                onClick={e => {
                  setBoardSelected(true);
                  console.log(
                    e.clientX - width / 2 - 70,
                    e.clientY - height / 2 - 111
                  );
                }}
              />
            ) : (
              <BoardPlaceholderWrap data={{ type: "board-placeholder" }}>
                {draggableData => (
                  <BoardPlaceholder active={!!draggableData}>
                    {t("robotics.drag-board-here")}
                  </BoardPlaceholder>
                )}
              </BoardPlaceholderWrap>
            )}
            {componentList.map(id => (
              <DraggableComponent key={id} id={id} />
            ))}
            {boardObject && (
              <Connectors visible={!!draggingConnector}>
                {boardObject.ports.map(port => (
                  <PortDroppable
                    active={!!draggingConnector}
                    key={port.name}
                    data={{ type: "port", port }}
                    top={port.position.y}
                    left={port.position.x}
                  >
                    {connector => (
                      <Port
                        dragging={!!connector}
                        width={port.width || 0}
                        height={port.height || 0}
                      />
                    )}
                  </PortDroppable>
                ))}
              </Connectors>
            )}
          </Canvas>
        </CanvasWrap>
        <HardwareTabs selectedBoard={boardObject} />
      </Container>
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

const CanvasItem = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  transform: translate(-50%, -50%);
`;

const Board = styled(CanvasItem)<{
  image: string;
  selected: boolean;
  dragging: boolean;
}>`
  cursor: pointer;
  background-image: url(${props => props.image});
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 300px;
  height: 224px;
  border-radius: 10px;
  border: ${props => (props.selected ? "solid 2px" : "none")};
  opacity: ${props => (props.dragging ? 0.3 : 1)};

  @media screen and (min-width: ${breakpoints.desktop}px) {
    width: 355px;
    height: 265px;
  }
`;

const BoardPlaceholderWrap = styled(Droppable)`
  position: absolute;
  top: 0px;
  left: 0px;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 224px;
  display: flex;

  @media screen and (min-width: ${breakpoints.desktop}px) {
    width: 355px;
    height: 265px;
  }
`;

const BoardPlaceholder = styled.div<{ active: boolean }>`
  flex: 1;
  background-color: ${colors.gray1};
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23bbb' stroke-width='4' stroke-dasharray='6%2c 10' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
  color: #bbb;
  font-size: 14px;
  font-style: italic;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CanvasComponent = styled.div<{ top: number; left: number }>`
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  transform: translate(-50%, -50%);
`;

const Connectors = styled.div<{ visible: boolean }>`
  visibility: ${props => (props.visible ? "visible" : "hidden")};
`;

const PortDroppable = styled(Droppable)<{
  top: number;
  left: number;
}>`
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
`;

const Port = styled.div<{
  width: number;
  height: number;
  dragging?: boolean;
}>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  border-radius: 2px;
  border: solid 1px #373b44;
  background-color: ${props =>
    props.dragging ? "#373b44" : "rgba(55, 59, 68, 0.3)"};
`;

const Connections = styled.svg`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
`;

const Connection = styled.path`
  stroke: ${colors.black};
  stroke-width: 3px;
  fill: none;
`;
