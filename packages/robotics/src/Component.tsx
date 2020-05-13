import React, { FC } from "react";
import styled from "@emotion/styled";
import { IComponent } from "@bitbloq/bloqs";
import { colors, Draggable } from "@bitbloq/ui";

export interface IComponentProps {
  component: IComponent;
  editable?: boolean;
  className?: string;
}

const Component: FC<IComponentProps> = ({
  component,
  editable = true,
  className
}) => {
  return (
    <Container className={className}>
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
          >
            <Connector />
          </ConnectorDraggable>
        ))}
    </Container>
  );
};

export default Component;

const Container = styled.div`
  display: inline-block;
  background: #d7d7d7;
  border-radius: 4px;
  position: relative;
`;

const Image = styled.img`
  margin: 20px;
`;

const ConnectorDraggable = styled(Draggable)<{ top: number; left: number }>`
  position: absolute;
  top: ${props => ((props.top + 1) / 2) * 100}%;
  left: ${props => ((props.left + 1) / 2) * 100}%;
  transform: translate(-50%, -50%);
`;

const Connector = styled.div`
  background-color: ${colors.black};
  width: 20px;
  height: 20px;
  border-radius: 10px;
`;
