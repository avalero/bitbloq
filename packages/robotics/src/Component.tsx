import React, { FC, useEffect } from "react";
import styled from "@emotion/styled";
import { colors, Draggable, useDraggable, useTranslate } from "@bitbloq/ui";
import { useRecoilState } from "recoil";
import { componentWithIdState, selectedComponentState } from "./state";
import useHardwareDefinition from "./useHardwareDefinition";
import useUpdateContent from "./useUpdateContent";

export interface IComponentProps {
  id: string;
}

const Component: FC<IComponentProps> = ({ id }) => {
  const t = useTranslate();
  const [instance, setInstance] = useRecoilState(componentWithIdState(id));
  const [selectedComponent, setSelectedComponent] = useRecoilState(
    selectedComponentState
  );
  const { getComponent } = useHardwareDefinition();
  const updateContent = useUpdateContent();
  const component = getComponent(instance.component);

  const containerProps = useDraggable({
    onDragStart: () => setSelectedComponent(id),
    onDrag: ({ x, y, height, width, element }) => {
      const {
        x: canvasX,
        y: canvasY
      } = element.parentElement!.getBoundingClientRect();
      setInstance({
        ...instance,
        position: { x: x - canvasX + width / 2, y: y - canvasY + height / 2 },
        width,
        height
      });
    },
    onDragEnd: () => updateContent()
  });

  useEffect(() => {
    const container = containerProps.ref.current;
    if (container) {
      const { width, height } = container.getBoundingClientRect();
      setInstance({
        ...instance,
        width,
        height
      });
    }
  }, []);

  if (!instance || !instance.position) {
    return null;
  }

  const isSelected = selectedComponent === id;

  return (
    <Container
      {...containerProps}
      onClick={() => setSelectedComponent(id)}
      selected={isSelected}
      style={{
        left: instance.position.x,
        top: instance.position.y
      }}
    >
      <NameInput
        value={instance.name}
        onMouseDown={e => e.stopPropagation()}
        onChange={e => setInstance({ ...instance, name: e.target.value })}
      />
      <img
        src={component.image.url}
        width={component.image.width}
        height={component.image.height}
        alt={component.label}
      />
      {component.connectors.map(connector => {
        const connected = !!instance.ports?.[connector.name];
        return (
          <Draggable
            key={connector.name}
            data={{ type: "connector", connector, instance }}
            draggableWidth={0}
            draggableHeight={0}
            offsetX={connected ? 26 : 10}
            offsetY={10}
          >
            {(props, dragging) => (
              <Connector
                {...props}
                dragging={dragging}
                selected={isSelected}
                connected={connected}
                style={{
                  left: `${((connector.position.x + 1) / 2) * 100}%`,
                  top: `${((connector.position.y + 1) / 2) * 100}%`
                }}
              >
                {connected &&
                  `${t("robotics.pin")} ${instance.ports?.[connector.name]}`}
              </Connector>
            )}
          </Draggable>
        );
      })}
    </Container>
  );
};

export default Component;

const Container = styled.div<{ selected: boolean }>`
  position: absolute;
  transform: translate(-50%, -50%);
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background: #d7d7d7;
  border-radius: 4px;
  padding: 10px;
  border-color: ${colors.black};
  border-style: solid;
  border-width: ${props => (props.selected ? 2 : 0)}px;
`;

const NameInput = styled.input`
  box-sizing: border-box;
  width: 120px;
  height: 26px;
  border-radius: 4px;
  box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.24);
  background-color: rgba(0, 0, 0, 0.2);
  border: none;
  color: white;
  font-size: 14px;
  padding: 0px 10px;
`;

const Connector = styled.div<{
  connected: boolean;
  dragging: boolean;
  selected: boolean;
}>`
  position: absolute;
  transform: translate(-50%, -50%);
  width: ${props => (props.connected ? 52 : 20)}px;
  height: 20px;
  border-radius: ${props => (props.connected ? 4 : 10)}px;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.selected ? colors.black : props.connected ? "#d7d7d7" : colors.green};
  display: ${props => (props.dragging ? "none" : "flex")};
  color: ${props => (props.selected ? "white" : colors.black)};
  font-size: 14px;
`;
