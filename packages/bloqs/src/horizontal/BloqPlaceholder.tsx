import React from "react";
import styled from "@emotion/styled";
import { colors, Icon } from "@bitbloq/ui";

import { BloqCategory } from "../index.d";

import { horizontalShapes } from "../config";

interface IBloqPlaceholderProps {
  category: BloqCategory;
  onClick: React.MouseEventHandler;
  selected?: boolean;
}

const BloqPlaceholder: React.FunctionComponent<IBloqPlaceholderProps> = ({
  category,
  onClick,
  selected
}) => {
  const ShapeComponent = horizontalShapes[category];

  return (
    <Container onClick={onClick} selected={selected}>
      <Icon name="plus" />
      <SVG>
        <g transform="translate(2,2)">
          <ShapeComponent
            fill="none"
            stroke={selected ? colors.brandOrange : "#bbb"}
            strokeWidth={2}
            strokeDasharray="7 3"
          />
        </g>
      </SVG>
    </Container>
  );
};

export default BloqPlaceholder;

/* styled components */

interface ContainerProps {
  selected?: boolean;
}
const Container = styled.div<ContainerProps>`
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => (props.selected ? colors.brandOrange : "#bbb")};
  width: 60px;
  height: 60px;
`;

const SVG = styled.svg`
  position: absolute;
  top: -2px;
  left: -2px;
  width: 68px;
  height: 64px;
`;
