import React, { useState } from "react";
import update from "immutability-helper";
import styled from "@emotion/styled";
import { colors } from "@bitbloq/ui";
import ComponentPlaceholder from "./ComponentPlaceholder";
import AddComponentPanel from "./AddComponentPanel";
import ComponentPropertiesPanel from "./ComponentPropertiesPanel";

import { IBoard, IComponent, IHardware } from "../index.d";

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

  const board = boards.find(b => b.name === hardware.board)!;
  const { width, height } = board.image;

  const selectedPort = board.ports[selectedPortIndex];
  const selectedComponent =
    selectedPort && hardware.components.find(c => c.port === selectedPort.name);

  return (
    <Container>
      <CanvasWrap onClick={() => setSelectedPortIndex(-1)}>
        <Canvas>
          {board.ports.map((port, i) => {
            const componentInstance = hardware.components.find(
              c => c.port === port.name
            );
            const top = (-port.placeholderPosition.y * height) / 2;
            const left = (port.placeholderPosition.x * width) / 2;

            if (componentInstance) {
              const component = components.find(
                c => c.name === componentInstance.component
              );
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
          })}
          <Board width={width} height={height} src={board.image.url} />
        </Canvas>
      </CanvasWrap>
      <AddComponentPanel
        isOpen={selectedPortIndex >= 0 && !selectedComponent}
        board={board}
        components={components}
        onComponentSelected={component => {
          setSelectedPortIndex(-1);
          onHardwareChange(
            update(hardware, {
              components: {
                $push: [
                  {
                    component: component.name,
                    name: "",
                    port: selectedPort.name
                  }
                ]
              }
            })
          );
        }}
      />
      <ComponentPropertiesPanel
        isOpen={!!selectedComponent}
        components={components}
        componentInstance={selectedComponent!}
      />
    </Container>
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
