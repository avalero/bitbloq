import React, { FC } from "react";
import styled from "@emotion/styled";
import { IComponent, IComponentInstance } from "@bitbloq/bloqs";
import { colors, Draggable } from "@bitbloq/ui";

export interface IComponentProps {
  component: IComponent;
  instance?: IComponentInstance;
  onChange?: (newInstance: IComponentInstance) => void;
  editable?: boolean;
  className?: string;
}

const Component: FC<IComponentProps> = ({
  component,
  instance,
  onChange,
  editable = true,
  className
}) => {
  return (
    <Container className={className}>
      {editable && instance && (
        <NameInput
          value={instance.name}
          onMouseDown={e => e.stopPropagation()}
          onChange={e =>
            onChange && onChange({ ...instance, name: e.target.value })
          }
        />
      )}
      <Image
        src={component.image.url}
        width={component.image.width}
        height={component.image.height}
        alt={component.label}
      />
      {editable &&
        component.connectors.map(connector => (
          <ConnectorDraggable
            key={connector.name}
            top={connector.position.y}
            left={connector.position.x}
            dragCopy={false}
            data={{ type: "connector", connector, instance }}
          >
            {dragging => <Connector dragging={dragging} />}
          </ConnectorDraggable>
        ))}
    </Container>
  );
};

export default Component;

const Container = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background: #d7d7d7;
  border-radius: 4px;
  position: relative;
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

const ConnectorDraggable = styled(Draggable)<{ top: number; left: number }>`
  position: absolute;
  top: ${props => ((props.top + 1) / 2) * 100}%;
  left: ${props => ((props.left + 1) / 2) * 100}%;
  transform: translate(-50%, -50%);
`;

const Connector = styled.div<{ dragging: boolean }>`
  background-color: ${colors.black};
  width: ${props => (props.dragging ? 10 : 20)}px;
  height: ${props => (props.dragging ? 10 : 20)}px;
  margin: ${props => (props.dragging ? 5 : 0)}px;
  border-radius: 10px;
`;
