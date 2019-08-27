import React, { useState } from "react";
import update from "immutability-helper";
import styled from "@emotion/styled";
import { colors, useTranslate } from "@bitbloq/ui";
import ComponentPlaceholder from "./ComponentPlaceholder";
import AddComponentPanel from "./AddComponentPanel";
import ComponentPropertiesPanel from "./ComponentPropertiesPanel";

import {
  IBoard,
  IComponent,
  IComponentInstance,
  IPort,
  IPortDirection,
  IHardware
} from "../index";

interface IHardwareDesignerProps {
  boards: IBoard[];
  components: IComponent[];
  hardware: IHardware;
  onHardwareChange: (hardware: IHardware) => any;
}

const HardwareDesigner: React.FunctionComponent<IHardwareDesignerProps> = ({
  boards,
  components,
  hardware,
  onHardwareChange
}) => {
  const [selectedPortIndex, setSelectedPortIndex] = useState(-1);

  const t = useTranslate();

  const board = boards.find(b => b.name === hardware.board)!;
  const { width, height } = board.image;

  const selectedPort = board.ports[selectedPortIndex];
  const selectedComponentInstance =
    selectedPort && hardware.components.find(c => c.port === selectedPort.name);

  const getInstanceName = (baseName: string, count: number = 0): string => {
    const name = `${baseName}${count || ""}`;
    const exist = hardware.components.some(c => c.name === name);
    return exist ? getInstanceName(baseName, count ? count + 1 : 2) : name;
  };

  const selectedComponent =
    selectedComponentInstance &&
    components.find(c => c.name === selectedComponentInstance.component)!;
  const availablePorts = selectedComponent
    ? board.ports.filter(
        p =>
          p === selectedPort ||
          (isCompatiblePort(p, selectedComponent) &&
            !hardware.components.some(c => c.port === p.name))
      )
    : [];

  const renderPort = (port: IPort, i: number) => {
    const componentInstance = hardware.components.find(
      c => c.port === port.name
    );
    const top = (-port.placeholderPosition.y * height) / 2;
    const left = (port.placeholderPosition.x * width) / 2;

    if (componentInstance) {
      const component = components.find(
        c => c.name === componentInstance.component
      )!;
      const image = (component && component.image) || {
        url: "",
        width: 0,
        height: 0
      };

      return (
        <Component
          key={i}
          selected={selectedPortIndex === i}
          top={top}
          left={left}
          width={image.width}
          height={image.height}
          src={image.url}
          onClick={e => {
            e.stopPropagation();
            setSelectedPortIndex(i);
          }}
        />
      );
    }

    return (
      <ComponentPlaceholder
        key={i}
        selected={selectedPortIndex === i}
        top={top}
        left={left}
        onClick={e => {
          e.stopPropagation();
          setSelectedPortIndex(i);
        }}
      />
    );
  };

  const connectionPath = (port: IPort) => {
    const componentInstance = hardware.components.find(
      c => c.port === port.name
    );

    const portX = (port.position.x * width) / 2;
    const portY = (-port.position.y * width) / 2;
    const placeholderX = (port.placeholderPosition.x * width) / 2;
    const placeholderY = (-port.placeholderPosition.y * height) / 2;

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

  const compatibleComponents = selectedPort
    ? components.filter(c => isCompatiblePort(selectedPort, c))
    : [];

  return (
    <Container>
      <CanvasWrap onClick={() => setSelectedPortIndex(-1)}>
        <ConnectionCanvas>
          {board.ports.map((port, i) => (
            <path
              key={port.name}
              d={connectionPath(port)}
              fill="none"
              stroke={selectedPortIndex === i ? colors.brandOrange : "#bbb"}
              strokeWidth={2}
              strokeDasharray="7 3"
            />
          ))}
        </ConnectionCanvas>
        <Canvas>
          {board.ports.map(renderPort)}
          <Board width={width} height={height} src={board.image.url} />
        </Canvas>
      </CanvasWrap>
      <AddComponentPanel
        isOpen={selectedPortIndex >= 0 && !selectedComponentInstance}
        board={board}
        components={compatibleComponents}
        onComponentSelected={component => {
          onHardwareChange(
            update(hardware, {
              components: {
                $push: [
                  {
                    component: component.name,
                    name: getInstanceName(t(component.instanceName)),
                    port: selectedPort.name
                  }
                ]
              }
            })
          );
        }}
      />
      <ComponentPropertiesPanel
        isOpen={!!selectedComponentInstance}
        components={components}
        componentInstance={selectedComponentInstance!}
        availablePorts={availablePorts}
        onDeleteComponent={() => {
          onHardwareChange({
            ...hardware,
            components: hardware.components.filter(
              c => c !== selectedComponentInstance
            )
          });
          setSelectedPortIndex(-1);
        }}
        onInstanceUpdate={(newInstance: IComponentInstance) => {
          onHardwareChange({
            ...hardware,
            components: hardware.components.map(c =>
              c === selectedComponentInstance ? newInstance : c
            )
          });
          setSelectedPortIndex(
            board.ports.findIndex(p => p.name === newInstance.port)
          );
        }}
      />
    </Container>
  );
};

const isCompatiblePort = (port: IPort, component: IComponent) => {
  return (
    component.connectors &&
    component.connectors.some(connector =>
      port.connectorTypes.includes(connector.type)
    )
  );
};

export default HardwareDesigner;

/* styled components */

const Container = styled.div`
  flex: 1;
  display: flex;
`;

const CanvasWrap = styled.div`
  flex: 1;
  position: relative;
`;

const Canvas = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
`;

const ConnectionCanvas = styled.svg`
  position: absolute;
  top: 50%;
  left: 50%;
  overflow: visible;
`;

interface IComponentProps {
  selected: boolean;
  width: number;
  height: number;
  top: number;
  left: number;
}
const Component = styled.img<IComponentProps>`
  position: absolute;
  cursor: pointer;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  transform: translate(-50%, -50%);
  border-color: ${props =>
    props.selected ? colors.brandOrange : "transparent"};
  border-style: solid;
  border-width: 2px;
  border-radius: 6px;
`;

interface IBoardProps {
  width: number;
  height: number;
}
const Board = styled.img<IBoardProps>`
  position: absolute;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  transform: translate(-50%, -50%);
`;
