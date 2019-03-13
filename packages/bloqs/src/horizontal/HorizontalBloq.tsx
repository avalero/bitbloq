import React from "react";
import styled from "@emotion/styled";
import EventShape from "./EventShape";
import { colors, horizontalShapes } from "../config";

import { BloqType } from "../index.d";

interface HorizontalBloqProps {
  type: BloqType;
  className?: string;
  onClick?: React.MouseEventHandler;
}

const HorizontalBloq: React.FunctionComponent<HorizontalBloqProps> = ({
  type,
  className,
  onClick
}) => {
  const ShapeComponent = horizontalShapes[type.category];

  return (
    <Container className={className} onClick={onClick}>
      <SVG>
        <g transform="translate(2,2)">
          <ShapeComponent fill={colors[type.category]} />
        </g>
      </SVG>
      {type.icon && <Icon src={type.icon} alt={type.name} />}
    </Container>
  );
};

export default HorizontalBloq;

/* styled components */

const Container = styled.div`
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bbb;
  width: 60px;
  height: 60px;
`;

const Icon = styled.img`
  margin-left: 4px;
  width: 44px;
  height: 44px;
  z-index: 1;
`;

const SVG = styled.svg`
  position: absolute;
  top: -2px;
  left: -2px;
  width: 68px;
  height: 64px;
`;
