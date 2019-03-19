import React from "react";
import styled from "@emotion/styled";
import { colors } from "@bitbloq/ui";
import { useSpring, animated } from "react-spring";

import { IBoard, IComponent } from "./index.d";

export interface IAddComponentPanelProps {
  isOpen: boolean;
  board: IBoard;
  components: IComponent[];
}

const AddComponentPanel: React.FunctionComponent<IAddComponentPanelProps> = ({
  isOpen,
  board,
  components
}) => {
  const wrapStyle = useSpring({
    width: isOpen ? 200 : 0,
    from: { width: 0 },
    config: { tension: 600, friction: 40 }
  });

  return (
    <Wrap style={wrapStyle}>
      <Content>
        {components.map(({ image }) => (image &&
          <Component
            src={image.url}
            width={image.width}
            height={image.height}
          />
        ))}
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
  border-left: 1px solid ${colors.gray3};
`;

interface IComponentProps {
  width: number;
  height: number;
}
const Component = styled.img<IComponentProps>``;
