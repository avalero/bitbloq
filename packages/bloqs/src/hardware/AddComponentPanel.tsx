import React from "react";
import styled from "@emotion/styled";
import { colors } from "@bitbloq/ui";
import { useSpring, animated } from "react-spring";

import { IBoard, IComponent } from "../index";

export interface IAddComponentPanelProps {
  isOpen: boolean;
  board: IBoard;
  components: IComponent[];
  onComponentSelected: (component: IComponent) => any;
}

const AddComponentPanel: React.FunctionComponent<IAddComponentPanelProps> = ({
  isOpen,
  board,
  components,
  onComponentSelected
}) => {
  const wrapStyle = useSpring({
    width: isOpen ? 200 : 0,
    from: { width: 0 },
    config: { tension: 600, friction: 40 }
  });

  return (
    <Wrap style={wrapStyle}>
      <Content>
        {components.map(
          (component, i) =>
            component.image && (
              <Component
                key={i}
                src={component.image.url}
                width={component.image.width}
                height={component.image.height}
                onClick={() => onComponentSelected(component)}
              />
            )
        )}
      </Content>
    </Wrap>
  );
};

function isCompatible(component: IComponent, board: IBoard) {
  return true;
}

export default AddComponentPanel;

/* styled components */

const Wrap = styled(animated.div)`
  overflow: hidden;
  display: flex;
`;

const Content = styled.div`
  display: flex;
  border-left: 1px solid ${colors.gray3};
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 20px;
  overflow-y: auto;
`;

interface IComponentProps {
  width: number;
  height: number;
}
const Component = styled.img<IComponentProps>`
  cursor: pointer;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  margin-bottom: 20px;
`;
