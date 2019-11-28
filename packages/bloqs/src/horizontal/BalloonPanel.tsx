import React from "react";
import styled from "@emotion/styled";
import { colors } from "@bitbloq/ui";

const BalloonPanel = styled.div<{ color?: string }>`
  background-color: ${props => props.color || colors.gray2};
  border-radius: 18px;
  margin-bottom: 30px;
  position: relative;

  &::after {
    content: "";
    display: block;
    border-width: 20px 20px 0px 20px;
    border-style: solid;
    border-color: ${props => props.color || colors.gray2} transparent
      transparent transparent;
    position: absolute;
    left: 50%;
    bottom: -20px;
    transform: translate(-50%, 0px);
  }
`;

export default BalloonPanel;
