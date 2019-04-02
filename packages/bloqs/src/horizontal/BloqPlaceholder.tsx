import React from "react";
import styled from "@emotion/styled";
import { colors, Icon } from "@bitbloq/ui";

import { BloqCategory } from "../enums";

import { horizontalShapes, halfHorizontalShapes } from "../config";

interface IBloqPlaceholderProps {
  category: BloqCategory;
  onClick: React.MouseEventHandler;
  selected?: boolean;
  half?: boolean;
}

const BloqPlaceholder: React.FunctionComponent<IBloqPlaceholderProps> = ({
  category,
  onClick,
  selected,
  half
}) => {
  const ShapeComponent = half
    ? halfHorizontalShapes[category]
    : horizontalShapes[category];

  return (
    <Container
      onClick={onClick}
      selected={selected}
      half={half}
      category={category}
    >
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

interface IContainerProps {
  selected?: boolean;
  half?: boolean;
  category: BloqCategory;
}
const Container = styled.div<IContainerProps>`
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => (props.selected ? colors.brandOrange : "#bbb")};
  width: ${props =>
    props.half ? 34 : props.category === BloqCategory.Event ? 66 : 60}px;
  height: 60px;
`;

const SVG = styled.svg`
  position: absolute;
  top: -2px;
  left: -2px;
  width: 68px;
  height: 64px;
`;
