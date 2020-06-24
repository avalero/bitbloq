import React, { FC } from "react";
import styled from "@emotion/styled";
import { IComponent, IComponentInstance } from "@bitbloq/bloqs";
import { colors, Draggable, useDraggable } from "@bitbloq/ui";
import { useRecoilState, useSetRecoilState } from "recoil";
import { componentWithIdState, draggingConnectorState } from "./state";
import useHardwareDefinition from "./useHardwareDefinition";

export interface IComponentProps {
  id: string;
}

const Component: FC<IComponentProps> = ({ id }) => {
  const [instance, setInstance] = useRecoilState<IComponentInstance>(
    componentWithIdState(id)
  );
  const setDraggingConnector = useSetRecoilState(draggingConnectorState);
  const { getComponent } = useHardwareDefinition();
  const component = getComponent(instance.component);

  const containerProps = useDraggable({
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
    }
  });

  if (!instance || !instance.position) {
    return null;
  }

  return (
    <Container
      {...containerProps}
      left={instance.position.x}
      top={instance.position.y}
    >
      <NameInput
        value={instance.name}
        onMouseDown={e => e.stopPropagation()}
        onChange={e => setInstance({ ...instance, name: e.target.value })}
      />
      <Image
        src={component.image.url}
        width={component.image.width}
        height={component.image.height}
        alt={component.label}
      />
      {component.connectors.map(connector => (
        <Draggable
          key={connector.name}
          data={{ type: "connector", connector, instance }}
          onDragStart={params =>
            setDraggingConnector({ x: params.x, y: params.y, connector })
          }
          onDrag={params =>
            setDraggingConnector({ x: params.x, y: params.y, connector })
          }
          onDragEnd={() => setDraggingConnector(null)}
        >
          {(props, dragging) => (
            <Connector
              {...props}
              dragging={dragging}
              top={connector.position.y}
              left={connector.position.x}
            />
          )}
        </Draggable>
      ))}
    </Container>
  );
};

export default Component;

const Container = styled.div<{ top: number; left: number }>`
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  transform: translate(-50%, -50%);
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background: #d7d7d7;
  border-radius: 4px;
  padding: 10px;
`;

const NameInput = styled.input`
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

const Image = styled.img`
  margin: 10px;
`;

const Connector = styled.div<{ dragging: boolean; top: number; left: number }>`
  position: absolute;
  top: ${props => ((props.top + 1) / 2) * 100}%;
  left: ${props => ((props.left + 1) / 2) * 100}%;
  transform: translate(-50%, -50%);
  background-color: ${colors.black};
  width: 20px;
  height: 20px;
  border-radius: 10px;
  display: ${props => (props.dragging ? "none" : "block")};
`;
