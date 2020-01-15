import React, { FC } from "react";
import styled from "@emotion/styled";
import { colors, Icon } from "@bitbloq/ui";
import BalloonPanel from "./BalloonPanel";

import {
  IComponentInstance,
  IBoard,
  IPort,
  IComponent,
  IPortDirection
} from "../index";

interface IPinSelectorProps {
  value: string;
  onChange: (newValue: string) => any;
  componentInstances: IComponentInstance[];
  fallbackComponent: string;
  board: IBoard;
  components: IComponent[];
}

const SCHEMA_WIDTH = 150;
const SCHEMA_HEIGHT = 110;
const HALF_SCHEMA_WIDTH = SCHEMA_WIDTH / 2;
const HALF_SCHEMA_HEIGHT = SCHEMA_HEIGHT / 2;

const PinSelector: FC<IPinSelectorProps> = ({
  value,
  onChange,
  componentInstances,
  fallbackComponent,
  board,
  components
}) => {
  const componentInstance = componentInstances.find(c => c.name === value)!;
  const component =
    componentInstance &&
    components.find(c => c.name === componentInstance.component);

  if (componentInstance && componentInstance.integrated) {
    return null;
  }

  const connectionPath = (port: IPort) => {
    const portX = port.schematicPosition.x * HALF_SCHEMA_WIDTH;
    const portY = -port.schematicPosition.y * HALF_SCHEMA_HEIGHT;
    const placeholderX =
      port.schematicPlaceholderPosition.x * HALF_SCHEMA_WIDTH;
    const placeholderY =
      -port.schematicPlaceholderPosition.y * HALF_SCHEMA_HEIGHT;

    if (
      port.direction === IPortDirection.West ||
      port.direction === IPortDirection.East
    ) {
      return `
        M ${portX},${portY}
        L ${placeholderX},${portY}
        L ${placeholderX},${placeholderY}
      `;
    }

    return `
      M ${portX},${portY}
      L ${portX},${placeholderY}
      L ${placeholderX},${placeholderY}
    `;
  };

  return (
    <Container>
      <Component color={component ? undefined : colors.red}>
        {component ? (
          <img src={component.image && component.image.url} />
        ) : (
          <Icon name="hardware-question" />
        )}
      </Component>
      <BoardSchema>
        <Connections
          viewBox={`-${HALF_SCHEMA_WIDTH} -${HALF_SCHEMA_HEIGHT} ${SCHEMA_WIDTH} ${SCHEMA_HEIGHT}`}
        >
          {board.ports.map((port, i) => (
            <React.Fragment key={port.name}>
              <path
                d={connectionPath(port)}
                fill="none"
                stroke="#c0c3c9"
                strokeWidth={2}
              />
              <circle
                fill="#c0c3c9"
                r={6}
                cx={port.schematicPlaceholderPosition.x * HALF_SCHEMA_WIDTH}
                cy={-port.schematicPlaceholderPosition.y * HALF_SCHEMA_HEIGHT}
              />
            </React.Fragment>
          ))}
        </Connections>
        {componentInstances.map(c => {
          const port = board.ports.find(p => p.name === c.port)!;
          return (
            <PortButton
              key={c.name}
              selected={componentInstance === c}
              left={
                port.schematicPlaceholderPosition.x * HALF_SCHEMA_WIDTH +
                HALF_SCHEMA_WIDTH +
                10
              }
              top={
                -port.schematicPlaceholderPosition.y * HALF_SCHEMA_HEIGHT +
                HALF_SCHEMA_HEIGHT +
                10
              }
              onClick={() => onChange(c.name)}
            >
              <button>{port.name}</button>
            </PortButton>
          );
        })}
        <BoardImage
          src={board.schematicImage.url}
          left={
            board.schematicCenter.x * HALF_SCHEMA_WIDTH + HALF_SCHEMA_WIDTH + 10
          }
          top={
            -board.schematicCenter.y * HALF_SCHEMA_HEIGHT +
            HALF_SCHEMA_HEIGHT +
            10
          }
        />
      </BoardSchema>
    </Container>
  );
};

export default PinSelector;

const Container = styled.div`
  margin-left: 20px;
  min-width: 170px;
`;

const Component = styled(BalloonPanel)`
  height: 100px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    height: 80px;
  }
  svg {
    width: 60px;
    height: 60px;
  }
`;

const BoardSchema = styled.div`
  background-color: ${colors.gray2};
  position: relative;
  padding: 10px;
`;

const Connections = styled.svg`
  width: ${SCHEMA_WIDTH};
  height: ${SCHEMA_HEIGHT};
`;

interface IPortButtonProps {
  selected?: boolean;
  top: number;
  left: number;
}
const PortButton = styled.div<IPortButtonProps>`
  position: absolute;
  transform: translate(-50%, -50%);
  top: ${props => props.top}px;
  left: ${props => props.left}px;

  button {
    cursor: pointer;
    border-radius: 2px;
    width: 30px;
    height: 30px;
    border: none;
    font-weight: bold;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => (props.selected ? "#c0c3c9" : "#fff")};
    box-shadow: 0 ${props => (props.selected ? 0 : 3)}px 0 0 #ddd;
    transform: translate(0, ${props => (props.selected ? 0 : -3)}px);

    &:focus {
      outline: none;
    }
  }
`;

const BoardImage = styled.img<{ top: number; left: number }>`
  position: absolute;
  transform: translate(-50%, -50%);
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  width: 60px;
  height: 60px;
`;
