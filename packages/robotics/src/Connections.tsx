import React, { FC, useRef, useState } from "react";
import styled from "@emotion/styled";
import { IConnector, IPortDirection } from "@bitbloq/bloqs";
import { colors, useResizeObserver } from "@bitbloq/ui";
import { useRecoilValue } from "recoil";
import {
  boardState,
  componentsState,
  ICanvasComponentInstance,
  draggingConnectorState,
  selectedComponentState
} from "./state";
import useHardwareDefinition from "./useHardwareDefinition";

const getConnectionPath = (
  x1: number,
  y1: number,
  d1: IPortDirection,
  x2: number,
  y2: number,
  d2: IPortDirection
) => {
  let path = `M ${x1} ${y1} `;
  const initialVertical =
    d1 === IPortDirection.South
      ? Math.max(20, y2 - y1 / 2)
      : d1 === IPortDirection.North
      ? Math.min(-20, y2 - y1 / 2)
      : 0;

  const diffX = x2 - x1;
  const diffY = y2 - y1;

  const finalHorizontal =
    d2 === IPortDirection.West ? 30 : d2 === IPortDirection.East ? -30 : 0;

  path += `l 0 ${initialVertical}`;
  path += `l ${diffX - finalHorizontal} 0`;
  path += `l 0 ${diffY - initialVertical}`;
  path += `l ${finalHorizontal} 0`;

  return path;
};

const Connections: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const board = useRecoilValue(boardState);
  const components = useRecoilValue(componentsState);
  const draggingConnector = useRecoilValue(draggingConnectorState);
  const selectedComponent = useRecoilValue(selectedComponentState);
  const { getBoard, getComponent } = useHardwareDefinition();

  useResizeObserver(
    containerRef,
    ({ x, y, width: canvasWidth, height: canvasHeight }) => {
      setX(x);
      setY(y);
      setWidth(canvasWidth);
      setHeight(canvasHeight);
    },
    [containerRef.current]
  );

  const boardObject = board && getBoard(board.name);

  if (!boardObject) {
    return null;
  }
  const renderConnection = (
    instance: ICanvasComponentInstance,
    connector: IConnector,
    endX: number,
    endY: number,
    isSelected: boolean,
    portDirection?: IPortDirection
  ) => {
    const { width: componentWidth, height: componentHeight } = instance;

    const connectorX =
      instance.position.x + (connector.position.x / 2) * componentWidth;
    const connectorY =
      instance.position.y + (connector.position.y / 2) * componentHeight;

    const path = getConnectionPath(
      connectorX,
      connectorY,
      connector.direction || IPortDirection.South,
      endX,
      endY,
      portDirection || IPortDirection.North
    );

    return (
      <Connection
        d={path}
        key={`${instance.name}-connector-${connector.name}`}
        stroke={isSelected ? colors.black : colors.green}
      />
    );
  };

  const renderDraggingConnection = () => {
    if (draggingConnector) {
      return renderConnection(
        draggingConnector.instance,
        draggingConnector.connector,
        draggingConnector.x - width / 2 - x,
        draggingConnector.y - height / 2 - y,
        true
      );
    }

    return null;
  };

  return (
    <Container ref={containerRef}>
      <svg>
        <g transform={`translate(${width / 2},${height / 2})`}>
          {components.map(instance => {
            const component = getComponent(instance.component);
            const ports = instance.ports || {};
            const isSelected = instance.id === selectedComponent;

            return Object.keys(ports).map(connector => {
              const port = ports[connector];
              const connectorObject = component.connectors.find(
                c => c.name === connector
              );
              const portObject = boardObject.ports.find(p => p.name === port);

              if (!connectorObject || !portObject || !instance.position) {
                return;
              }

              const portX =
                (portObject.position.x + (portObject.width || 0) / 2) *
                (board?.width || 0);
              const portY =
                (portObject.position.y + (portObject.height || 0) / 2) *
                (board?.height || 0);

              return renderConnection(
                instance,
                connectorObject,
                portX,
                portY,
                isSelected,
                portObject.direction
              );
            });
          })}
          {renderDraggingConnection()}
        </g>
      </svg>
    </Container>
  );
};

export default Connections;

const Container = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  pointer-events: none;

  svg {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
  }
`;

const Connection = styled.path`
  stroke-width: 3px;
  fill: none;
`;
