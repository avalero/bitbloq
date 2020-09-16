import React, { FC } from "react";
import styled from "@emotion/styled";
import { IConnector, IPortDirection } from "@bitbloq/bloqs";
import { colors } from "@bitbloq/ui";
import { useRecoilValue } from "recoil";
import {
  boardState,
  componentsState,
  ICanvasComponentInstance,
  draggingConnectorState
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
  if (d1 === IPortDirection.South) {
    path += `L ${x1} ${(y1 + y2) / 2}`;
    path += `L ${x2} ${(y1 + y2) / 2}`;
  }

  path += `L ${x2} ${y2}`;

  return path;
};

export interface IConnectionsProps {
  height: number;
  width: number;
}

const Connections: FC<IConnectionsProps> = ({ height, width }) => {
  const board = useRecoilValue(boardState);
  const components = useRecoilValue(componentsState);
  const draggingConnector = useRecoilValue(draggingConnectorState);
  const { getBoard, getComponent } = useHardwareDefinition();

  const boardObject = board && getBoard(board.name);

  if (!boardObject) {
    return null;
  }

  const renderConnection = (
    instance: ICanvasComponentInstance,
    connector: IConnector,
    endX: number,
    endY: number,
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
      />
    );
  };

  const renderDraggingConnection = () => {
    if (draggingConnector) {
      return renderConnection(
        draggingConnector.instance,
        draggingConnector.connector,
        draggingConnector.x,
        draggingConnector.y
      );
    }

    return null;
  };

  return (
    <Container>
      <g transform={`translate(${width / 2},${height / 2})`}>
        {components.map(instance => {
          const component = getComponent(instance.component);
          const ports = instance.ports || {};

          return Object.keys(ports).map(connector => {
            const port = ports[connector];
            const connectorObject = component.connectors.find(
              c => c.name === connector
            );
            const portObject = boardObject.ports.find(p => p.name === port);

            if (!connectorObject || !portObject || !instance.position) {
              return;
            }

            const portX = portObject.position.x + (portObject.width || 0) / 2;
            const portY = portObject.position.y + (portObject.height || 0) / 2;

            return renderConnection(
              instance,
              connectorObject,
              portX,
              portY,
              portObject.direction
            );
          });
        })}
        {renderDraggingConnection()}
      </g>
    </Container>
  );
};

export default Connections;

const Container = styled.svg`
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
