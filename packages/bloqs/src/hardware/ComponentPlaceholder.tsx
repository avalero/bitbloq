import React from "react";
import styled from "@emotion/styled";
import { colors, Icon } from "@bitbloq/ui";

export interface IComponentPlaceholderProps {
  top: number;
  left: number;
  selected?: boolean;
  onClick?: React.MouseEventHandler;
}

const ComponentPlaceholder: React.FunctionComponent<
  IComponentPlaceholderProps
> = ({ selected, top, left, onClick }) => {
  return (
    <Container selected={selected} top={top} left={left} onClick={onClick}>
      <SVG>
        <circle
          cx={32}
          cy={32}
          r={30}
          fill="white"
          stroke={selected ? colors.brandOrange : "#bbb"}
          strokeWidth={2}
          strokeDasharray="7 3"
        />
      </SVG>
      <Icon name="plus" />
    </Container>
  );
};

export default ComponentPlaceholder;

/* styled components */

interface IContainerProps {
  selected?: boolean;
  top: number;
  left: number;
}
const Container = styled.div<IContainerProps>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  color: ${props => (props.selected ? colors.brandOrange : "#bbb")};
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  transform: translate(-50%, -50%);
  cursor: pointer;

  svg {
    z-index: 10;
  }
`;

const SVG = styled.svg`
  position: absolute;
  top: -2px;
  left: -2px;
  width: 64px;
  height: 64px;
  z-index: 0;
`;
