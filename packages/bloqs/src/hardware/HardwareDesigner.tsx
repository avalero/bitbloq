import React, { useState, useEffect } from "react";
import update from "immutability-helper";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import {
  breakpoints,
  colors,
  useTranslate,
  JuniorButton,
  Icon
} from "@bitbloq/ui";
import ComponentPlaceholder from "./ComponentPlaceholder";
import AddComponentPanel from "./AddComponentPanel";

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
  onHardwareChange?: (hardware: IHardware) => any;
  readOnly?: boolean;
}

const HardwareDesigner: React.FunctionComponent<IHardwareDesignerProps> = ({
  boards,
  components,
  hardware,
  onHardwareChange = () => null,
  readOnly
}) => {
  const [selectedPortIndex, setSelectedPortIndex] = useState(-1);
  const [isDesktop, setIsDesktop] = useState(
    window.innerWidth >= breakpoints.desktop
  );
  useEffect(() => {
    const onResize = () => {
      setIsDesktop(window.innerWidth >= breakpoints.desktop);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const t = useTranslate();

  const board = boards.find(b => b.name === hardware.board)!;
  const { width, height } = (!isDesktop && board.image.tablet) || board.image;

  const getInstanceInPort = (port: IPort) =>
    port &&
    hardware.components.find(c =>
      Object.values(c.ports || {}).includes(port.name)
    );

  const selectedPort = board.ports[selectedPortIndex];
  const selectedComponentInstance = getInstanceInPort(selectedPort);

  const getInstanceName = (baseName: string, count = 0): string => {
    const name = `${baseName}${count || ""}`;
    const exist = hardware.components.some(c => c.name === name);
    return exist ? getInstanceName(baseName, count ? count + 1 : 2) : name;
  };

  const selectedComponent =
    selectedComponentInstance &&
    components.find(c => c.name === selectedComponentInstance.component)!;

  const renderPort = (port: IPort, i: number) => {
    const componentInstance = getInstanceInPort(port);
    const placeholderPosition =
      (!isDesktop && port.placeholderPosition.tablet) ||
      port.placeholderPosition;
    const top = (-placeholderPosition.y * height) / 2;
    const left = (placeholderPosition.x * width) / 2;

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
          selected={selectedPortIndex === i}
          key={i}
          top={top}
          left={left}
          readOnly={readOnly}
        >
          <ComponentImageWrap selected={selectedPortIndex === i}>
            <ComponentImage width={image.width} height={image.height}>
              <img
                src={image.url}
                onClick={e => {
                  e.stopPropagation();
                  if (!readOnly) {
                    setSelectedPortIndex(i);
                  }
                }}
              />
            </ComponentImage>
          </ComponentImageWrap>
          {selectedPortIndex === i && (
            <DeleteWrap>
              <DeleteButton
                red
                onClick={() => {
                  onHardwareChange({
                    ...hardware,
                    components: hardware.components.filter(
                      c => c !== componentInstance
                    )
                  });
                  setSelectedPortIndex(-1);
                }}
              >
                <Icon name="trash" />
              </DeleteButton>
            </DeleteWrap>
          )}
        </Component>
      );
    } else if (!readOnly) {
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
    } else {
      return null;
    }
  };

  const connectionPath = (port: IPort) => {
    const position = (!isDesktop && port.position.tablet) || port.position;
    const portX = (position.x * width) / 2;
    const portY = (-position.y * height) / 2;
    const placeholderPosition =
      (!isDesktop && port.placeholderPosition.tablet) ||
      port.placeholderPosition;
    const placeholderX = (placeholderPosition.x * width) / 2;
    const placeholderY = (-placeholderPosition.y * height) / 2;

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

  const connectionCircle = (port: IPort, selected: boolean) => {
    const position = (!isDesktop && port.position.tablet) || port.position;
    const portX = (position.x * width) / 2;
    const portY = (-position.y * width) / 2;

    return (
      <circle
        r="5"
        cx={portX}
        cy={portY}
        fill={selected ? colors.brandOrange : "#bbb"}
      />
    );
  };

  const compatibleComponents = selectedPort
    ? components.filter(c => isCompatiblePort(selectedPort, c))
    : [];

  return (
    <Container>
      <ScrollContainer>
        <CanvasWrap onClick={() => setSelectedPortIndex(-1)}>
          <Canvas>
            <Board width={width} height={height} src={board.image.url} />
          </Canvas>
          <ConnectionCanvas>
            {board.ports.map((port, i) => {
              const componentInstance = getInstanceInPort(port);
              if (readOnly && !componentInstance) {
                return null;
              }
              return (
                <g key={port.name}>
                  <path
                    key={port.name}
                    d={connectionPath(port)}
                    fill="none"
                    stroke={
                      selectedPortIndex === i ? colors.brandOrange : "#bbb"
                    }
                    strokeWidth={2}
                    strokeDasharray={componentInstance ? "0" : "7 3"}
                  />
                  {connectionCircle(port, selectedPortIndex === i)}
                </g>
              );
            })}
          </ConnectionCanvas>
          <Canvas>{board.ports.map(renderPort)}</Canvas>
        </CanvasWrap>
      </ScrollContainer>
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
                    ports: {
                      main: selectedPort.name
                    }
                  }
                ]
              }
            })
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

const ScrollContainer = styled.div`
  flex: 1;
  display: flex;
  overflow: auto;
`;

const CanvasWrap = styled.div`
  flex: 1;
  position: relative;
  margin-top: 90px;
  min-height: 380px;
  @media screen and (min-width: ${breakpoints.desktop}px) {
    min-height: 460px;
  }
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

const Component = styled.div<{
  top: number;
  left: number;
  selected: boolean;
  readOnly?: boolean;
}>`
  position: absolute;
  cursor: ${props => (props.readOnly ? "default" : "pointer")};
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  transform: translate(-50%, -50%);
  border-radius: 6px;
  background-color: white;
  z-index: 10;

  ${props =>
    props.selected &&
    css`
      filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.3));
      padding: 10px;
      z-index: 20;
    `}
`;

const ComponentImageWrap = styled.div<{ selected: boolean }>`
  padding-bottom: 3px;
  border-color: ${colors.brandOrange};
  border-width: 2px;
  border-style: ${props => (props.selected ? "solid" : "none")};
  border-radius: 5px;
`;

const ComponentImage = styled.div<{ width: number; height: number }>`
  border-radius: 3px;
  padding: 10px;
  background-color: #f1f1f1;
  box-shadow: 0 3px 0 0 #bbb;
  img {
    width: ${props => props.width}px;
    height: ${props => props.height}px;
  }
`;

const DeleteWrap = styled.div`
  border-radius: 5px;
  position: absolute;
  padding: 10px;
  background-color: white;
  top: 0px;
  right: -50px;
`;

const DeleteButton = styled(JuniorButton)`
  padding: 0px;
  width: 40px;
  height: 40px;

  svg {
    width: 20px;
    height: 20px;
  }
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
